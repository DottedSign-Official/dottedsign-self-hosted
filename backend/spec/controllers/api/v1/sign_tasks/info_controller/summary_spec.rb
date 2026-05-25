require 'rails_helper'

RSpec.describe Api::V1::SignTasks::InfoController, type: :request do
  include_context 'rpdoc'

  before(:each) do |example|
    example.metadata[:rpdoc_action_key] = 'summary'
    example.metadata[:rpdoc_action_name] = 'get task summary'
    example.metadata[:rpdoc_example_folders] = ['v1', 'sign_tasks', 'info']

    @member = mock_member(:member_me, skip_auth: example.metadata[:skip_auth])
    @headers = {'Authorization' => 'Bearer {{rabbit_token}}'}
    @path = '/api/v1/sign_tasks/summary'
  end

  describe '#summary' do

    it 'should return 200', rpdoc_example_key: 200, rpdoc_example_name: 'get tasks summary success' do
      get @path, headers: @headers
      expect(response).to have_http_status(200)
    end

    it 'should get 1 waiting for me count', rpdoc_skip: true do
      FactoryBot.create(:waiting_for_me1)
      get @path, headers: @headers
      expect(json['data']['waiting_for_me']).to eq(1)
      expect(json['data']['waiting_for_others']).to eq(0)
      expect(json['data']['completed']).to eq(0)
      expect(json['data']['draft']).to eq(0)
    end

    it 'should get 1 waiting for other count', rpdoc_skip: true do
      FactoryBot.create(:waiting_for_others1)
      get @path, headers: @headers
      expect(json['data']['waiting_for_me']).to eq(0)
      expect(json['data']['waiting_for_others']).to eq(1)
      expect(json['data']['completed']).to eq(0)
      expect(json['data']['draft']).to eq(0)
    end

    it 'should get 1 completed count', rpdoc_skip: true do
      FactoryBot.create(:completed_task1)
      get @path, headers: @headers
      expect(json['data']['waiting_for_me']).to eq(0)
      expect(json['data']['waiting_for_others']).to eq(0)
      expect(json['data']['completed']).to eq(1)
      expect(json['data']['draft']).to eq(0)
    end

    it 'should get 1 draft count', rpdoc_skip: true do
      FactoryBot.create(:draft_task)
      get @path, headers: @headers
      expect(json['data']['waiting_for_me']).to eq(0)
      expect(json['data']['waiting_for_others']).to eq(0)
      expect(json['data']['completed']).to eq(0)
      expect(json['data']['draft']).to eq(1)
    end

    it 'should get 2 cancel count', rpdoc_skip: true do
      FactoryBot.create(:declined_task1)
      FactoryBot.create(:expired_task1)

      get @path, headers: @headers
      expect(json['data']['waiting_for_me']).to eq(0)
      expect(json['data']['waiting_for_others']).to eq(0)
      expect(json['data']['completed']).to eq(0)
      expect(json['data']['draft']).to eq(0)
      expect(json['data']['canceled']).to eq(2)
    end

    it 'should return 400003 if invalid member', rpdoc_example_key: 400003, rpdoc_example_name: 'get tasks summary failed (invalid member)', skip_auth: true do
      @headers['Authorization'] = 'Bearer invalid-token'
      get @path, headers: @headers
      expect(response).to have_http_status(400)
      expect(json['error_code']).to eq(400003)
      expect(json['error_key']).to eq('invalid_member')
    end
  end
end
