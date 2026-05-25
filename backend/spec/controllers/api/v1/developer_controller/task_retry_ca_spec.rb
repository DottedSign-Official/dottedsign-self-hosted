require 'rails_helper'

RSpec.describe Api::V1::DeveloperController, type: :request do
  include_context 'rpdoc'

  before(:each) do |example|
    example.metadata[:rpdoc_action_key] = 'retry_task'
    example.metadata[:rpdoc_action_name] = '重試 CA 壓印'
    example.metadata[:rpdoc_example_folders] = ['v1', 'developer', 'sign_tasks']

    mock_developer
    mock_http_send
    @member = mock_member(:member_me, skip_auth: example.metadata[:skip_auth])
    @headers = {
      'Authorization' => 'Bearer {{rabbit_token}}'
    }
    @task = FactoryBot.create(:waiting_for_me1)
  end

  describe '#tasks' do
    before(:each) do
      @path = '/api/v1/developer/task_retry_ca'
      @params = {
        sign_task_id: @task.id
      }
    end

    it 'should return 200', rpdoc_example_key: 200, rpdoc_example_name: 'retry ca success' do
      put @path, params: @params, headers: @headers
      expect(response).to have_http_status(200)
    end

  end

end
