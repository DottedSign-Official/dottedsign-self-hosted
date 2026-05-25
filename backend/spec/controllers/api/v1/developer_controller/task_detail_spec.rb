require 'rails_helper'

RSpec.describe Api::V1::DeveloperController, type: :request do
  include_context 'rpdoc'

  before(:each) do |example|
    example.metadata[:rpdoc_action_key] = 'task_detail'
    example.metadata[:rpdoc_action_name] = '取得任務詳細資訊'
    example.metadata[:rpdoc_example_folders] =  ['v1', 'developer', 'sign_tasks']

    mock_developer
    mock_http_send
    @member = mock_member(:member_me, skip_auth: example.metadata[:skip_auth])
    @headers = {
      'Authorization' => 'Bearer {{rabbit_token}}'
    }
    @task = FactoryBot.create(:completed_task1)
  end

  describe '#tasks' do
    before(:each) do
      @path = '/api/v1/developer/task_detail'
      @params = {sign_task_id: @task.id}
    end

    it 'should return 200', rpdoc_example_key: 200_1, rpdoc_example_name: 'get tasks success (waiting task)' do
      task = FactoryBot.create(:waiting_for_me1)
      params = {sign_task_id: task.id}
      get "#{@path}?#{URI.encode_www_form(@params)}", headers: @headers
      expect(response).to have_http_status(200)
    end

    it 'should return 200', rpdoc_example_key: 200_2, rpdoc_example_name: 'get tasks success (completed task)' do
      task = FactoryBot.create(:completed_task1)
      params = {sign_task_id: task.id}
      get "#{@path}?#{URI.encode_www_form(params)}", headers: @headers
      expect(response).to have_http_status(200)
    end

    it 'should return 403_1301 if member not developer', rpdoc_example_key: 403_1301, rpdoc_example_name: 'get tasks failed (member not developer)' do
      task = FactoryBot.create(:waiting_for_me1)
      params = {sign_task_id: task.id}
      allow_any_instance_of(Member).to receive(:super_admin?).and_return(false)
      get "#{@path}?#{URI.encode_www_form(@params)}", headers: @headers
      expect(response).to have_http_status(403)
      expect(json['error_code']).to eq(403_1301)
    end
  end

end
