require 'rails_helper'

RSpec.describe Api::V1::DeveloperController, type: :request do
  include_context 'rpdoc'

  before(:each) do |example|
    example.metadata[:rpdoc_action_key] = 'tasks'
    example.metadata[:rpdoc_action_name] = '取得相關任務列表'
    example.metadata[:rpdoc_example_folders] = ['v1', 'developer', 'sign_tasks']

    mock_developer
    mock_http_send
    @member = mock_member(:member_me, skip_auth: example.metadata[:skip_auth])
    @headers = {
      'Authorization' => 'Bearer {{rabbit_token}}'
    }
    2.times { |_| FactoryBot.create(:waiting_for_me1) }
    3.times { |_| FactoryBot.create(:waiting_for_others1) }
    1.times { |_| FactoryBot.create(:completed_task1) }
    1.times { |_| FactoryBot.create(:draft_task) }

    2.times { |_| FactoryBot.create(:waiting_for_me_envelope) }
    3.times { |_| FactoryBot.create(:waiting_for_others_envelope) }
    1.times { |_| FactoryBot.create(:completed_envelope) }
    1.times { |_| FactoryBot.create(:draft_envelope) }
  end

  describe '#tasks' do
    before(:each) do
      @path = '/api/v1/developer/tasks'
      @params = {
        search_email: @member.email,
        start_from: 1.day.ago.strftime('%Y%m%d'),
        end_at: Time.now.strftime('%Y%m%d')
      }
    end

    it 'should return 200', rpdoc_example_key: 200, rpdoc_example_name: 'get tasks success by email' do
      get "#{@path}?#{URI.encode_www_form(@params)}", headers: @headers
      expect(response).to have_http_status(200)
      expect(json['data']['task_infos'].length).to eq(2 + 3 + 1 + 1 + (2 + 3 + 1 + 1) * 2)
    end

    it 'should return 200 if search with task_id', rpdoc_example_key: 200, rpdoc_example_name: 'get task with specific task_id success' do
      @params = {
        search_task_id: SignTask.first.id
      }
      get "#{@path}?#{URI.encode_www_form(@params)}", headers: @headers
      expect(response).to have_http_status(200)
      expect(json['data']['task_infos'].length).to eq(1)
    end

    it 'should return 200 if search with task_id', rpdoc_skip: true do
      task = Envelope.first.first_task
      @params = {
        search_task_id: task.id
      }
      get "#{@path}?#{URI.encode_www_form(@params)}", headers: @headers
      expect(response).to have_http_status(200)
      expect(json['data']['task_infos'].length).to eq(1)
      expect(json['data']['task_infos'][0]['id']).to eq(task.id)
      expect(json['data']['task_infos'][0]['file_name']).to eq(task.file_name)
      expect(json['data']['task_infos'][0]['envelope_id']).to eq(task.envelope_id)
      expect(json['data']['task_infos'][0]['envelope_name']).to eq(task.envelope.envelope_name)
    end

    it 'should return 200 if search with envelope_id', rpdoc_example_key: 200_2, rpdoc_example_name: 'get tasks with specific envelope_id success' do
      @params = {
        search_envelope_id: Envelope.first.id
      }
      get "#{@path}?#{URI.encode_www_form(@params)}", headers: @headers
      expect(response).to have_http_status(200)
      expect(json['data']['task_infos'].length).to eq(2)
    end

    it 'should return 403_1301 if member not developer', rpdoc_example_key: 403_1301, rpdoc_example_name: 'get tasks failed (member not developer)' do
      allow_any_instance_of(Member).to receive(:super_admin?).and_return(false)
      get "#{@path}?#{URI.encode_www_form(@params)}", headers: @headers
      expect(response).to have_http_status(403)
      expect(json['error_code']).to eq(403_1301)
    end
  end

end
