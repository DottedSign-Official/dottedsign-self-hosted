require 'rails_helper'

RSpec.describe Api::V1::SignTasks::ChangeController, type: :request do
  include_context 'rpdoc'

  before(:each) do |example|
    example.metadata[:rpdoc_action_key] = 'change_signer_requisition'
    example.metadata[:rpdoc_action_name] = 'send change signer request'
    example.metadata[:rpdoc_example_folders] = ['v1', 'sign_tasks', 'change']

    build_test_members
    @member = mock_member(:member_me, skip_auth: example.metadata[:skip_auth])
    @headers = {
      'Content-Type' => 'application/json',
      'Authorization' => 'Bearer {{rabbit_token}}'
    }
    @path = '/api/v1/sign_tasks/change_signer_requisition'
  end

  describe '#change_signer_requisition' do
    before(:each) do
      mock_http_send
      @task = FactoryBot.create(:waiting_for_me1)
      @params = {
        sign_task_id: @task.id,
        message: 'message'
      }
    end

    it 'should return 200', rpdoc_example_key: 200, rpdoc_example_name: '[sign task] send change signer request by sign_task_id success' do
      post @path, params: @params.to_json, headers: @headers
      expect(response).to have_http_status(200)
    end

    it 'should return 200', rpdoc_example_key: 200_2, rpdoc_example_name: '[envelope] send change signer request by envelope_id success' do
      envelope = FactoryBot.create(:waiting_for_me_envelope)
      params = { envelope_id: envelope.id, message: 'message' }
      post @path, params: params.to_json, headers: @headers
      expect(response).to have_http_status(200)
    end

    it 'should return 200', rpdoc_example_key: 200_3, rpdoc_example_name: '[envelope] send change signer request by code success' do
      envelope = FactoryBot.create(:waiting_for_me_envelope)
      code = envelope.original_file.preview_code(envelope.stages.first, will_expired: true)
      params = { code: code, message: 'message' }
      post @path, params: params.to_json, headers: @headers
      expect(response).to have_http_status(200)
    end

    it 'should return 403036 if not signer stage', rpdoc_example_key: 403036, rpdoc_example_name: "[sign task] change signer failed (not signer's stage, cannot access)" do
      task = FactoryBot.create(:not_related)
      @params[:sign_task_id] = task.id
      post @path, params: @params.to_json, headers: @headers
      expect(response).to have_http_status(403)
      expect(json['error_code']).to eq(403036)
      expect(json['error_key']).to eq('task_not_accessible')
    end

    it 'should return 403067 if not signer stage', rpdoc_example_key: 403067, rpdoc_example_name: "[envelope] change signer failed (not signer's stage, cannot access)" do
      envelope = FactoryBot.create(:not_related_envelope)
      params = { envelope_id: envelope.id, message: 'message' }
      post @path, params: params.to_json, headers: @headers
      expect(response).to have_http_status(403)
      expect(json['error_code']).to eq(403067)
      expect(json['error_key']).to eq('envelope_not_accessible')
    end

    it 'should return 400003 if invalid member', rpdoc_example_key: 400003, rpdoc_example_name: 'send change signer request failed (invalid member)', skip_auth: true do
      @headers['Authorization'] = 'Bearer invalid-token'
      post @path, params: @params.to_json, headers: @headers
      expect(response).to have_http_status(400)
      expect(json['error_code']).to eq(400003)
      expect(json['error_key']).to eq('invalid_member')
    end
  end

end
