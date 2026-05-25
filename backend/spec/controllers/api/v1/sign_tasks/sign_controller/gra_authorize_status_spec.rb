require 'rails_helper'

RSpec.describe Api::V1::SignTasks::SignController, type: :request do
  include_context 'redis_cache'
  include_context 'rpdoc'

  before(:each) do |example|
    example.metadata[:rpdoc_action_key] = 'gra_authorize_status'
    example.metadata[:rpdoc_action_name] = 'get gra authorize status'
    example.metadata[:rpdoc_example_folders] = ['v1', 'sign_tasks', 'sign']
    @path = '/api/v1/sign_tasks/gra_authorize_status'
    @headers = { 'Authorization' => 'Bearer {{rabbit_token}}' }
  end

  describe '#gra_authorize_status' do
    context '[sign task]' do
      before(:each) do |example|
        @task = FactoryBot.create(:signer_need_otp_task, verify_type: 'cht_personal')
        @stage = @task.stages.first
        mock_setup_current_member(@stage.actor)
        @params = {
          task_id: @task.id,
          stage_id: @stage.id
        }
      end

      it 'should return 200 and get success status result', rpdoc_example_key: 200_1, rpdoc_example_name: 'authorize status is success' do
        Rails.cache.write("ca_auth:#{@stage.verify_methods[0]["uuid"]}", "testing")
        get @path, params: @params, headers: @headers
        expect(response).to have_http_status(200)
        expect(json['data']['status']).to eq('ca_auth_success')
      end

      it 'should return 200 and get failed status result', rpdoc_example_key: 200_2, rpdoc_example_name: 'authorize status is failed' do
        get @path, params: @params, headers: @headers
        expect(response).to have_http_status(200)
        expect(json['data']['status']).to eq('ca_auth_failed')
      end
    end

    context '[envelope]' do
      before(:each) do |example|
        @envelope = FactoryBot.create(:signer_need_otp_envelope)
        @dummy_stage = @envelope.dummy_stages.first
        @sign_stage = @envelope.sign_stages.first
        mock_setup_current_member(@dummy_stage.actor)
        @params = {
          envelope_id: @envelope.id,
          stage_id: @dummy_stage.id
        }
      end

      it 'should return 200 and get success status result', rpdoc_example_key: 200_3, rpdoc_example_name: '[envelope] authorize status is success' do
        Rails.cache.write("ca_auth:#{@sign_stage.verify_methods[0]["uuid"]}", "testing")
        get @path, params: @params, headers: @headers
        expect(response).to have_http_status(200)
        expect(json['data']['status']).to eq('ca_auth_success')
      end

      it 'should return 200 and get failed status result', rpdoc_example_key: 200_4, rpdoc_example_name: '[envelope] authorize status is failed' do
        get @path, params: @params, headers: @headers
        expect(response).to have_http_status(200)
        expect(json['data']['status']).to eq('ca_auth_failed')
      end
    end
  end
end
