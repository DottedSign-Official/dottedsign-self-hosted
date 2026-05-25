require 'rails_helper'

RSpec.describe Api::Internal::SignTasksController, type: :request do
  include_context 'rpdoc'

  before(:each) do |example|
    example.metadata[:rpdoc_action_key] = 'task_info'
    example.metadata[:rpdoc_action_name] = '取得任務詳細資料'
    example.metadata[:rpdoc_example_folders] = ['internal', 'sign_tasks']

    @member = mock_member(:member_me, skip_auth: false)
    @headers = { 'Content-Type' => 'application/json' }
    @path = '/api/internal/sign_tasks/task_info'
  end

  describe '#task_info' do
    before(:each) do |example|
      @task = FactoryBot.create(:waiting_for_me1)
    end

    it 'should return 200', rpdoc_example_key: 200, rpdoc_example_name: 'get task task_info success' do
      @params = {
        sign_task_id: @task.id
      }

      get "#{@path}?#{URI.encode_www_form(@params)}"
      expect(response).to have_http_status(200)
    end
  end
end