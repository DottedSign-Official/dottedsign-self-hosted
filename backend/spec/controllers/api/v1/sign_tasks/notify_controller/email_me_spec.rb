require 'rails_helper'

RSpec.describe Api::V1::SignTasks::NotifyController, type: :request do
  include_context 'rpdoc'

  before(:each) do |example|
    example.metadata[:rpdoc_action_key] = 'email_me'
    example.metadata[:rpdoc_action_name] = 'send backup mail to myself'
    example.metadata[:rpdoc_example_folders] = ['v1', 'sign_tasks', 'notify']

    @member = mock_member(:member_me, skip_auth: example.metadata[:skip_auth])
    @headers = {
      'Content-Type' => 'application/json',
      'Authorization' => 'Bearer {{rabbit_token}}'
    }
    @path = '/api/v1/sign_tasks/email_me'
    mock_worker(Notification::BackupMailWorker)
  end

  describe '#email_me' do
    before(:each) do
      @task = FactoryBot.create(:completed_task1)
      @params = {
        sign_task_id: @task.id
      }
    end

    it 'should return 200 if email success', rpdoc_example_key: 200, rpdoc_example_name: 'send backup mail to myself success' do
      post @path, params: @params.to_json, headers: @headers
      expect(response).to have_http_status(200)
    end

    it 'should return 400040 if file is not ready', rpdoc_example_key: 200, rpdoc_example_name: 'send backup mail to myself failed (complete file not ready yet)' do
      @task.completed_file.destroy
      post @path, params: @params.to_json, headers: @headers
      expect(response).to have_http_status(400)
      expect(json['error_code']).to eq(400040)
    end

    it 'should return 400003 if invalid member', rpdoc_example_key: 400003, rpdoc_example_name: 'send backup mail to myself failed (invalid member)', skip_auth: true do
      @headers['Authorization'] = 'Bearer invalid-token'
      post @path, params: @params.to_json, headers: @headers
      expect(response).to have_http_status(400)
      expect(json['error_code']).to eq(400003)
      expect(json['error_key']).to eq('invalid_member')
    end
  end

end
