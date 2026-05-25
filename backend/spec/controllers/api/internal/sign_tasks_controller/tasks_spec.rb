require 'rails_helper'

RSpec.describe Api::Internal::SignTasksController, type: :request do
  include_context 'rpdoc'

  before(:each) do |example|
    example.metadata[:rpdoc_action_key] = 'tasks'
    example.metadata[:rpdoc_action_name] = '取得相關任務列表'
    example.metadata[:rpdoc_example_folders] = ['internal', 'sign_tasks']

    mock_http_send
    @member = mock_member(:member_me, skip_auth: example.metadata[:skip_auth])
    @path = '/api/internal/sign_tasks/tasks'
    @headers = {
      'Authorization' => 'Bearer {{rabbit_token}}'
    }
    2.times { |_| FactoryBot.create(:waiting_for_me1) }
    3.times { |_| FactoryBot.create(:waiting_for_others1) }
    1.times { |_| FactoryBot.create(:completed_task1) }
    1.times { |_| FactoryBot.create(:draft_task) }
  end

  describe '#tasks' do
    before(:each) do
      @params = {
        search_email: @member.email,
        start_from: 1.day.ago.strftime('%Y%m%d'),
        end_at: Time.now.strftime('%Y%m%d')
      }
    end

    it 'should return 200', rpdoc_example_key: 200, rpdoc_example_name: 'get tasks success by email' do
      get "#{@path}?#{URI.encode_www_form(@params)}", headers: @headers
      expect(response).to have_http_status(200)
      expect(json['data']['task_infos'].length).to eq(2 + 3 + 1 + 1)
    end

    it 'should return 200 if search_type is file_name', rpdoc_example_key: 200_1, rpdoc_example_name: 'get tasks success by file_name' do
      @params = {
        search_task_id: SignTask.first.id
      }
      get "#{@path}?#{URI.encode_www_form(@params)}", headers: @headers
      expect(response).to have_http_status(200)
      expect(json['data']['task_infos'].length).to eq(1)
    end

  end

end
