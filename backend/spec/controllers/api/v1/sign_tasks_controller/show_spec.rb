require 'rails_helper'

RSpec.describe Api::V1::SignTasksController, type: :request do
  include_context 'rpdoc'

  before(:each) do |example|
    example.metadata[:rpdoc_action_key] = 'show'
    example.metadata[:rpdoc_action_name] = 'show task detail'
    example.metadata[:rpdoc_example_folders] = ['v1', 'sign_tasks']

    @member = mock_member(:member_me, skip_auth: example.metadata[:skip_auth])
    task = FactoryBot.create(:waiting_for_me1)
    @headers = {
      'Authorization' => 'Bearer {{rabbit_token}}'
    }
    @path = "/api/v1/sign_tasks/#{task.id}"
  end

  describe '#show' do

    it 'should return 200', rpdoc_example_key: 200, rpdoc_example_name: 'show task detail success' do
      get @path, headers: @headers
      expect(response).to have_http_status(200)
    end

    it 'should return 200 and expired', rpdoc_example_key: 200, rpdoc_example_name: 'show task detail success' do
      expired_now_task = FactoryBot.create(:waiting_for_me3)
      get "/api/v1/sign_tasks/#{expired_now_task.id}", headers: @headers
      expect(response).to have_http_status(200)
      expect(json['data']['status']).to eq('expired')
    end

    it 'should return 400003 if invalid member', rpdoc_example_key: 400003, rpdoc_example_name: 'show task detail failed (invalid member)', skip_auth: true do
      @headers['Authorization'] = 'Bearer invalid-token'
      get @path, headers: @headers
      expect(response).to have_http_status(400)
      expect(json['error_code']).to eq(400003)
      expect(json['error_key']).to eq('invalid_member')
    end
  end
end
