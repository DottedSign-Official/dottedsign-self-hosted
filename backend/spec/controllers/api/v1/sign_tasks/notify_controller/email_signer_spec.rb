require 'rails_helper'

RSpec.describe Api::V1::SignTasks::NotifyController, type: :request do
  include_context 'rpdoc'

  before(:each) do |example|
    example.metadata[:rpdoc_action_key] = 'email_signer'
    example.metadata[:rpdoc_action_name] = 'resend sign link to signer'
    example.metadata[:rpdoc_example_folders] = ['v1', 'sign_tasks', 'notify']

    @member = mock_member(:member_me, skip_auth: example.metadata[:skip_auth])
    @headers = {
      'Content-Type' => 'application/json',
      'Authorization' => 'Bearer {{rabbit_token}}'
    }
    @path = '/api/v1/sign_tasks/email_signer'
    mock_worker(Notification::ProcessingMailWorker)
  end

  describe '#email_signer' do
    before(:each) do
      @task = FactoryBot.create(:waiting_for_me1)
      @params = {
        sign_task_id: @task.id,
        email: @task.sign_stages.processing[0].actor.email
      }
    end

    it 'should return 200 if email success', rpdoc_example_key: 200, rpdoc_example_name: '[sign task] resend sign link to signer success' do
      post @path, params: @params.to_json, headers: @headers
      expect(response).to have_http_status(200)
    end

    it 'should return 200 if email success', rpdoc_example_key: 200_2, rpdoc_example_name: '[envelope] resend sign link to signer success' do
      envelope = FactoryBot.create(:waiting_for_me_envelope)
      params = { envelope_id: envelope.id, email: envelope.dummy_stages.processing[0].actor.email }
      post @path, params: params.to_json, headers: @headers
      expect(response).to have_http_status(200)
    end

    it 'should return 404032 if stage not found', rpdoc_example_key: 404032, rpdoc_example_name: '[sign task] resend sign link to signer failed (signer not found)' do
      task = FactoryBot.create(:completed_task1)
      @params[:sign_task_id] = task.id
      @params[:email] = task.owner.email
      post @path, params: @params.to_json, headers: @headers
      expect(response).to have_http_status(404)
      expect(json['error_code']).to eq(404032)
    end

    it 'should return 404032 if stage not found', rpdoc_example_key: 404032_2, rpdoc_example_name: '[envelope] resend sign link to signer failed (signer not found)' do
      envelope = FactoryBot.create(:completed_envelope)
      params = { envelope_id: envelope.id, email: envelope.owner.email }
      post @path, params: params.to_json, headers: @headers
      expect(response).to have_http_status(404)
      expect(json['error_code']).to eq(404032)
    end

    it 'should return 400003 if invalid member', rpdoc_example_key: 400003, rpdoc_example_name: 'resend sign link to signer failed (invalid member)', skip_auth: true do
      @headers['Authorization'] = 'Bearer invalid-token'
      post @path, params: @params.to_json, headers: @headers
      expect(response).to have_http_status(400)
      expect(json['error_code']).to eq(400003)
      expect(json['error_key']).to eq('invalid_member')
    end
  end

end
