require 'rails_helper'

RSpec.describe Api::V1::SignTasks::SignController, type: :request do
  include_context 'redis_cache'
  include_context 'rpdoc'

  before(:each) do |example|
    example.metadata[:rpdoc_action_key] = 'trigger_verify'
    example.metadata[:rpdoc_action_name] = 'trigger verify again (OTP)'
    example.metadata[:rpdoc_example_folders] = ['v1', 'sign_tasks', 'sign']

    @headers = {
      'Content-Type' => 'application/json',
      'Authorization' => 'Bearer {{rabbit_token}}'
    }
    @member = mock_member(:member_me, skip_auth: example.metadata[:skip_auth])
    @path = '/api/v1/sign_tasks/trigger_verify'
    allow(MailCenter).to receive(:signer_verify).and_return({'status' => 200})
  end

  describe '#trigger_verify' do
    context '[sign task]' do
      before(:each) do
        task = FactoryBot.create(:signer_need_otp_task)
        @params = {
          sign_task_id: task.id,
          uuid: 'uuid',
          signer_email: @member.email
        }
      end

      it 'should return 200 if signer has set otp verify', rpdoc_example_key: 200_1, rpdoc_example_name: 'trigger sign verify success (signer protected)' do
        member = mock_member(:member_otp)
        @params[:signer_email] = member.email
        post @path, params: @params.to_json, headers: @headers
        expect(response).to have_http_status(200)
      end

      it 'should return 200 if owner has set otp verify', rpdoc_example_key: 200_2, rpdoc_example_name: 'trigger sign verify success (owner protected)' do
        task = FactoryBot.create(:owner_need_otp_task)
        @params[:sign_task_id] = task.id
        @params[:uuid] = task.sign_stages[0].verify_methods[0].uuid
        post @path, params: @params.to_json, headers: @headers
        expect(response).to have_http_status(200)
      end

      it 'should return 400039 if neither owner nor signer has set otp verify', rpdoc_example_key: 400039, rpdoc_example_name: 'trigger sign verify failed (neither owner nor signer has set otp verify)' do
        task = FactoryBot.create(:waiting_for_me1)
        @params[:sign_task_id] = task.id
        post @path, params: @params.to_json, headers: @headers
        expect(response).to have_http_status(400)
        expect(json['error_code']).to eq(400039)
      end

      it 'should return 400041 if request too frequently', rpdoc_example_key: 400041, rpdoc_example_name: 'trigger sign verify failed (request too frequently)' do
        task = FactoryBot.create(:owner_need_otp_task)
        @params[:sign_task_id] = task.id
        @params[:uuid] = task.sign_stages[0].verify_methods[0].uuid
        post @path, params: @params.to_json, headers: @headers
        post @path, params: @params.to_json, headers: @headers
        expect(response).to have_http_status(400)
        expect(json['error_code']).to eq(400041)
      end

      it 'should return 400003 if invalid member', rpdoc_example_key: 400003, rpdoc_example_name: 'trigger sign verify failed (invalid member)', skip_auth: true do
        @headers['Authorization'] = 'Bearer invalid-token'
        post @path, params: @params.to_json, headers: @headers
        expect(response).to have_http_status(400)
        expect(json['error_code']).to eq(400003)
        expect(json['error_key']).to eq('invalid_member')
      end
    end

    context '[envelope]' do
      before(:each) do
        envelope = FactoryBot.create(:signer_need_otp_envelope)
        @params = {
          envelope_id: envelope.id,
          uuid: 'uuid',
          signer_email: @member.email
        }
      end

      it 'should return 200 if signer has set otp verify', rpdoc_example_key: 200_3, rpdoc_example_name: 'trigger sign verify success (signer protected)' do
        member = mock_member(:member_otp)
        @params[:signer_email] = member.email
        post @path, params: @params.to_json, headers: @headers
        expect(response).to have_http_status(200)
      end

      it 'should return 200 if owner has set otp verify', rpdoc_example_key: 200_4, rpdoc_example_name: 'trigger sign verify success (owner protected)' do
        envelope = FactoryBot.create(:owner_need_otp_envelope)
        @params[:envelope_id] = envelope.id
        @params[:uuid] = envelope.sign_stages[0].verify_methods[0].uuid
        post @path, params: @params.to_json, headers: @headers
        expect(response).to have_http_status(200)
      end

      it 'should return 400039 if neither owner nor signer has set otp verify', rpdoc_example_key: 400039_2, rpdoc_example_name: 'trigger sign verify failed (neither owner nor signer has set otp verify)' do
        envelope = FactoryBot.create(:waiting_for_me_envelope)
        @params[:envelope_id] = envelope.id
        post @path, params: @params.to_json, headers: @headers
        expect(response).to have_http_status(400)
        expect(json['error_code']).to eq(400039)
      end

      it 'should return 400041 if request too frequently', rpdoc_example_key: 400041_2, rpdoc_example_name: 'trigger sign verify failed (request too frequently)' do
        envelope = FactoryBot.create(:owner_need_otp_envelope)
        @params[:envelope_id] = envelope.id
        @params[:uuid] = envelope.sign_stages[0].verify_methods[0].uuid
        post @path, params: @params.to_json, headers: @headers
        post @path, params: @params.to_json, headers: @headers
        expect(response).to have_http_status(400)
        expect(json['error_code']).to eq(400041)
      end
    end
  end
end
