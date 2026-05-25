require 'rails_helper'

RSpec.describe Api::V1::SignTasksController, type: :request do
  include_context 'rpdoc'

  before(:each) do |example|
    example.metadata[:rpdoc_action_key] = 'preview_share_link'
    example.metadata[:rpdoc_action_name] = 'get task share link tasks'
    example.metadata[:rpdoc_example_folders] = ['v1', 'sign_tasks']

    @member = mock_member(:member_me, skip_auth: example.metadata[:skip_auth])
    @task = FactoryBot.create(:completed_task1)
    @headers = {
      'Authorization' => 'Bearer {{rabbit_token}}'
    }
    @path = '/api/v1/sign_tasks/preview_share_link'
  end

  describe '#preview_share_link' do
    before(:each) do
      @params = {
        sign_task_id: @task.id
      }
    end

    it 'should return 200 and get share link', rpdoc_example_key: 200, rpdoc_example_name: 'get task share link success' do
      get "#{@path}?#{URI.encode_www_form(@params)}", headers: @headers
      expect(response).to have_http_status(200)
      expect(json['data']).to have_key('share_link')
    end

    it 'should return 403033 if member not own the task', rpdoc_example_key: 400003, rpdoc_example_name: 'get task share link failed (member not task owner)' do
      member = mock_member(:member_a)
      get "#{@path}?#{URI.encode_www_form(@params)}", headers: @headers
      expect(response).to have_http_status(403)
      expect(json['error_code']).to eq(403033)
      expect(json['error_key']).to eq('task_not_owned')
    end

    it 'should return 400003 if invalid member', rpdoc_example_key: 400003, rpdoc_example_name: 'get task share link failed (invalid member)', skip_auth: true do
      @headers['Authorization'] = 'Bearer invalid-token'
      get "#{@path}?#{URI.encode_www_form(@params)}", headers: @headers
      expect(response).to have_http_status(400)
      expect(json['error_code']).to eq(400003)
      expect(json['error_key']).to eq('invalid_member')
    end
  end
end
