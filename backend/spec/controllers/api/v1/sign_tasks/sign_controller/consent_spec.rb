require 'rails_helper'

RSpec.describe Api::V1::SignTasks::SignController, type: :request do
  include_context 'redis_cache'
  include_context 'rpdoc'

  before(:each) do |example|
    example.metadata[:rpdoc_action_key] = 'consent'
    example.metadata[:rpdoc_action_name] = 'consent to sign'
    example.metadata[:rpdoc_example_folders] = ['v1', 'sign_tasks', 'sign']

    @headers = {
      'Content-Type' => 'application/json'
    }
    @path = '/api/v1/sign_tasks/consent'
  end

  describe '#consent' do
    before(:each) do
      @params = {
        check: true,
        client: 'web',
        ip_address: '0.0.0.0',
        code: nil,
        work_id: 'random_work_id'
      }
    end

    it 'should return 200 if consent success', rpdoc_example_key: 200, rpdoc_example_name: 'consent to sign success' do
      task = FactoryBot.create(:quick_sign_task)
      not_kdan_stage = task.processing_stages[0]
      @params[:code] = task.original_file.preview_code(not_kdan_stage)
      post @path, params: @params.to_json, headers: @headers
      expect(response).to have_http_status(200)
    end

    it 'should return 400035 for task already complete', rpdoc_example_key: 400035, rpdoc_example_name: 'consent to sign failed (task already complete)' do
      task = FactoryBot.create(:quick_sign_completed_task)
      not_kdan_done_stage = task.sign_stages.done[0]
      @params[:code] = task.original_file.preview_code(not_kdan_done_stage)
      post @path, params: @params.to_json, headers: @headers
      expect(response).to have_http_status(400)
      expect(json['error_code']).to eq(400035)
    end

    it 'should store and get consent cached value', rpdoc_skip: true do
      task = FactoryBot.create(:quick_sign_task)
      not_kdan_stage = task.processing_stages[0]
      @params[:code] = task.original_file.preview_code(not_kdan_stage)
      post @path, params: @params.to_json, headers: @headers
      expect(json['data']['client']).to eq(@params[:client])
      expect(json['data']['ip_address']).to eq(@params[:ip_address])
      expect(json['data']['work_id']).to eq(@params[:work_id])
      expect(cache.exist?("#{@params[:code]}:quick_sign_accept")).to be(true)
    end

    it 'should return 400061 if preview code invalid', rpdoc_example_key: 400061, rpdoc_example_name: 'consent to sign failed (preview code invalid)' do
      @params[:code] = 'invalid-preview-code'
      post @path, params: @params.to_json, headers: @headers
      expect(response).to have_http_status(400)
      expect(json['error_code']).to eq(400061)
      expect(json['error_key']).to eq('invalid_preview_code')
    end
  end
end
