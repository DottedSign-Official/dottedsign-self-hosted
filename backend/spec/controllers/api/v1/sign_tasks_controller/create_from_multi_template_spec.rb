require 'rails_helper'

RSpec.describe Api::V1::SignTasksController, type: :request do
  include_context 'rpdoc'

  before(:each) do |example|
    example.metadata[:rpdoc_example_folders] = ['v1', 'sign_tasks']
    allow(File).to receive(:open).and_return(StringIO.new("1\n2\n3"))
    allow(PDF::Reader).to receive(:new).and_return(PDF::Reader.new("#{Rails.root}/spec/fixtures/files/test.pdf"))
    allow_any_instance_of(PDF::Reader).to receive(:page_count).and_return(1)
    mock_upload
    mock_file_processing_service
    mock_service(KmpdfTool::PdfFileMerge)

    @member = mock_member(:member_me, skip_auth: example.metadata[:skip_auth])

    @headers = { 'Authorization' => 'Bearer {{rabbit_token}}', 'Content-Type' => 'application/json' }

    @path = '/api/v1/sign_tasks'
  end

  after(:each) do
    allow(File).to receive(:open).and_call_original
  end

  describe '#create_from_multi_template' do
    before(:each) do |example|
      example.metadata[:rpdoc_action_key] = 'create_from_multi_template'
      example.metadata[:rpdoc_action_name] = 'create task from multi template'
      mock_file_attached
      mock_with_sign_url_enable

      allow_any_instance_of(KmpdfTool::XfdfExporter).to receive(:result).and_return({
                                                                                      "stage_1" => "content",
                                                                                      "stage_2" => "content",
                                                                                      "stage_3" => "content"
                                                                                    })

      @signer_a = FactoryBot.create(:member_a)
      @signer_b = FactoryBot.create(:member_b)
      @template_a = FactoryBot.create(:template, owner: @member, dummy_stage_count: 2)
      @template_b = FactoryBot.create(:template, owner: @member, dummy_stage_count: 1)

      @params = {
        "file_name": "create_and_invite",
        "has_order": true,
        "template_codes": [@template_a.code, @template_b.code],
        "stages": [
          {
            "email": @member.email,
            "name": @member.name,
            "role": @template_a.dummy_stages.first.actor_info["role"]
          },
          {
            "email": @signer_a.email,
            "name": @signer_a.name,
            "role": @template_b.dummy_stages.first.actor_info["role"]
          },
          {
            "email": @signer_b.email,
            "name": @signer_b.name,
            "role": @template_a.dummy_stages.second.actor_info["role"]
          }
        ],
        "receiver_lang": "en",
        "forget_remind": false,
        "with_sign_url": true,
        "need_ca": false,
        "client": "web",
        "ip_address": "211.22.240.100"
      }
    end

    it 'should return 200 and get task info', rpdoc_example_key: 200, rpdoc_example_name: 'create task from template_codes success' do
      post "#{@path}/create_from_multi_template", params: @params.to_json, headers: @headers
      expect(response).to have_http_status(200)
      expect(json['data']['file_name']).to eq(@params[:file_name])
      expect(json['data']['sign_type']).to eq('create_and_invite')
      expect(json['data']['has_order']).to eq(@params[:has_order])
      expect(json['data']['status']).to eq('waiting')
      expect(json['data']['current_member_turn']).to eq(true)
      expect(json['data']['own_by_me']).to eq(true)
      json['data']['stage_infos'].each do |stage|
        expect(stage['sign_url']).to be_present
      end
    end

    it 'should return 200 and get task info', rpdoc_example_key: 200_2, rpdoc_example_name: 'create task from tempalte_codes and change base pdf success' do
      change_file = open("#{Rails.root}/spec/fixtures/files/test-2.pdf")
      @params[:file] = Base64.strict_encode64(change_file.read)

      post "#{@path}/create_from_multi_template", params: @params.to_json, headers: @headers

      expect(response).to have_http_status(200)
      expect(json['data']['file_name']).to eq(@params[:file_name])
      expect(json['data']['sign_type']).to eq('create_and_invite')
      expect(json['data']['has_order']).to eq(@params[:has_order])
      expect(json['data']['status']).to eq('waiting')
      expect(json['data']['current_member_turn']).to eq(true)
      expect(json['data']['own_by_me']).to eq(true)
      json['data']['stage_infos'].each do |stage|
        expect(stage['sign_url']).to be_present
      end
    end
  end
end
