require 'rails_helper'

RSpec.describe Api::V1::DeveloperController, type: :request do
  include_context 'rpdoc'

  before(:each) do |example|
    example.metadata[:rpdoc_action_key] = 'reissue'
    example.metadata[:rpdoc_action_name] = '重新發送簽署階段'
    example.metadata[:rpdoc_example_folders] = ['v1', 'developer', 'sign_tasks']

    allow_any_instance_of(KmpdfTool::XfdfExporter).to receive(:result).and_return({
      "stage_1" => "content",
      "stage_2" => "content"
    })

    @task = FactoryBot.create(:a_file_failed_task)
    @stage = @task.sign_stages.first

    mock_member(:member_me)
    mock_developer

    @headers = {
      'Authorization' => 'Bearer {{rabbit_token}}',
      'Content-Type' => 'application/json'
    }
  end

  describe '#tasks' do
    before(:each) do
      @path = '/api/v1/developer/reissue'
      @params = {
        sign_task_id: @task.id,
        stage_id: @stage.id
      }
    end

    it 'should return 200', rpdoc_example_key: 200, rpdoc_example_name: 'reissue task success' do
      post @path, params: @params.to_json, headers: @headers
      expect(response).to have_http_status(200)

      @task.reload
      @stage.reload

      expect(@task.status).to eq('waiting')
      expect(@stage.status).to eq('processing')
      expect(@task.sign_events.last.action_name).to eq('reissue')
    end
  end

end
