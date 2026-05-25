require 'rails_helper'

RSpec.describe Api::V1::SignTasksController, type: :request do
  include_context 'rpdoc'

  before(:each) do |example|
    example.metadata[:rpdoc_action_key] = 'start'
    example.metadata[:rpdoc_action_name] = 'start task signing flow'
    example.metadata[:rpdoc_example_folders] = ['v1', 'sign_tasks']

    @member = mock_member(:member_me, skip_auth: example.metadata[:skip_auth])
    @headers = {
      'Content-Type' => 'application/json',
      'Authorization' => 'Bearer {{rabbit_token}}'
    }
    @path = '/api/v1/sign_tasks/start'
  end

  describe '#start' do
    before(:each) do
      @task = FactoryBot.create(:draft_task)
      @params = {
        sign_task_id: @task.id
      }
    end

    it 'should return 200 if task is draft', rpdoc_example_key: 200, rpdoc_example_name: 'start task flow success' do
      post @path, params: @params.to_json, headers: @headers

      @task.reload
      expect(response).to have_http_status(200)
      expect(@task.status).to eq('waiting')
    end

    it 'should return 400030 if task is processing', rpdoc_example_key: 400030_1, rpdoc_example_name: 'start task flow failed (task already processing)' do
      task = FactoryBot.create(:waiting_for_me1)
      @params[:sign_task_id] = task.id
      post @path, params: @params.to_json, headers: @headers
      expect(response).to have_http_status(400)
      expect(json['error_code']).to eq(400030)
    end

    it 'should return 400030 if task is completed', rpdoc_example_key: 400030_2, rpdoc_example_name: 'start task flow failed (task already completed)' do
      task = FactoryBot.create(:completed_task1)
      @params[:sign_task_id] = task.id
      post @path, params: @params.to_json, headers: @headers
      expect(response).to have_http_status(400)
      expect(json['error_code']).to eq(400030)
    end

    it 'should return 400003 if invalid member', rpdoc_example_key: 400003, rpdoc_example_name: 'start task flow failed (invalid member)', skip_auth: true do
      @headers['Authorization'] = 'Bearer invalid-token'
      post @path, params: @params.to_json, headers: @headers
      expect(response).to have_http_status(400)
      expect(json['error_code']).to eq(400003)
      expect(json['error_key']).to eq('invalid_member')
    end
  end
end
