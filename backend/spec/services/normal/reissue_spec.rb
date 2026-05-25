require 'rails_helper'

RSpec.describe Normal::Reissue, type: :model do
  describe '#call' do
    before(:each) do
      @member = mock_member(:member_me, skip_auth: true)
      mock_group(@member, role: 'admin')
      @task = FactoryBot.create(:a_file_failed_task)
      @stage = @task.sign_stages.first
      allow_any_instance_of(KmpdfTool::XfdfExporter).to receive(:result).and_return({
        "stage_1" => "content",
        "stage_2" => "content"
      })
    end

    it 'should reissue the task' do
      service = Normal::Reissue.call(@task.id, @stage, @member, {})

      expect(service.success?).to eq(true)
      @stage.reload
      @task.reload
      expect(@task.status).to eq('waiting')
      expect(@stage.status).to eq('processing')
      expect(@task.sign_events.last.action_name).to eq('reissue')
    end
  end
end