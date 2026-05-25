require 'rails_helper'

RSpec.describe TemplateMerger, type: :model do
  before(:each) do
    mock_reader = PDF::Reader.new("#{Rails.root}/spec/fixtures/files/test.pdf")
    original_file = File.read("#{Rails.root}/spec/fixtures/files/test.pdf")
    allow_any_instance_of(ServiceFile).to receive_message_chain(:file, :attached?).and_return(true)
    allow_any_instance_of(ServiceFile).to receive_message_chain(:file, :download).and_return(original_file)
    allow(PDF::Reader).to receive(:new).and_return(mock_reader)
    allow_any_instance_of(PDF::Reader).to receive(:page_count).and_return(3)
    mock_service(KmpdfTool::PdfFileMerge)
  end

  after(:each) do
    FileUtils.rm_rf(@merger.working_dir) if @merger&.working_dir
  end

  describe '#call' do
    before(:each) do
      @member = mock_member(:member_me)
      template_a = FactoryBot.create(:template, owner: @member, dummy_stage_count: 2)
      template_b = FactoryBot.create(:template, owner: @member, dummy_stage_count: 1)
      @templates = [template_a, template_b]

      signer_a = FactoryBot.create(:member_a)
      signer_b = FactoryBot.create(:member_b)
      signers = [signer_a, signer_b]

      required_roles = @templates.flat_map(&:dummy_stages)
                                 .map { |stage| stage.actor_info['role'] }

      @task_info = {}.with_indifferent_access
      @task_info[:file_name] = 'test-merged-file'
      @task_info[:hash_order] = true
      @task_info[:stages] = required_roles.flat_map do |role|
        signer = signers.sample
        {
          mail: signer.email,
          name: signer.name,
          role: role
        }
      end
    end

    it 'should build dummy template from two templates' do
      @merger = TemplateMerger.call(@member.id, @templates, @task_info)

      expect(@merger.success?).to eq(true)

      template = @merger.result
      template.dummy_stages.each_with_index do |stage, index|
        expect(stage.actor_info['role']).to eq(@task_info[:stages][index]['role'])
      end
    end
  end

  describe '#duplicate template' do
    before(:each) do
      @member = mock_member(:member_me)
      template = FactoryBot.create(:template, owner: @member, dummy_stage_count: 2)
      @templates = [template, template]

      signer_a = FactoryBot.create(:member_a)
      signer_b = FactoryBot.create(:member_b)
      signers = [signer_a, signer_b]

      required_roles = @templates.flat_map(&:dummy_stages)
                                 .map { |stage| stage.actor_info['role'] }

      @task_info = {}.with_indifferent_access
      @task_info[:file_name] = 'test-merged-file'
      @task_info[:hash_order] = true
      @task_info[:stages] = required_roles.flat_map do |role|
        signer = signers.sample
        {
          mail: signer.email,
          name: signer.name,
          role: role
        }
      end
    end

    it 'should build dummy template from duplicate templates' do
      @merger = TemplateMerger.call(@member.id, @templates, @task_info)
      expect(@merger.success?).to eq(true)

      template = @merger.result
      template.dummy_stages.each_with_index do |stage, index|
        expect(stage.actor_info['role']).to eq(@task_info[:stages][index]['role'])
      end
    end
  end
end
