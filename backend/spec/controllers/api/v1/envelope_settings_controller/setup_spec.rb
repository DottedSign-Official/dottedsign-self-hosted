require 'rails_helper'

RSpec.describe Api::V1::EnvelopeSettingsController, type: :request do
  include_context 'rpdoc'

  before(:each) do |example|
    example.metadata[:rpdoc_action_key] = 'setup'
    example.metadata[:rpdoc_action_name] = 'setup envelope setting'
    example.metadata[:rpdoc_example_folders] = ['v1', 'envelope_settings']

    @member = mock_member(:member_me, skip_auth: example.metadata[:skip_auth])
    @headers = {
      'Content-Type' => 'application/json',
      'Authorization' => 'Bearer {{rabbit_token}}'
    }
    @path = '/api/v1/envelope_settings/setup'
    @envelope = FactoryBot.create(:waiting_for_me_envelope)
    @envelope_setting = @envelope.envelope_setting
  end

  describe '#setup' do
    before(:each) do
      @params = {
        envelope_id: @envelope.id,
        need_otp_verify: true
      }
    end

    it 'should update envelope setting and task settings', rpdoc_skip: true do
      post @path, params: @params.to_json, headers: @headers
      expect(response).to have_http_status(200)

    end

    it 'should update forget_remind and deadline', rpdoc_example_key: 200, rpdoc_example_name: 'setup envelope setting success' do
      @params[:forget_remind] = false
      @params[:deadline] = 2.weeks.after.to_i
      post @path, params: @params.to_json, headers: @headers
      expect(json['data']['forget_remind']).to eq(@params[:forget_remind])
      expect(json['data']['deadline']).to eq(@params[:deadline])
      expect(json['data']['message']).to eq(@envelope_setting.message)
      expect(json['data']['need_otp_verify']).to eq(@params[:need_otp_verify])
      expect(json['data']['receiver_lang']).to eq(@envelope_setting.receiver_lang)
      task_setting = @envelope.first_task.task_setting
      expect(task_setting.forget_remind).to eq(@params[:forget_remind])
      expect(task_setting.deadline.to_i).to eq(@params[:deadline])
      expect(task_setting.message).to eq(@envelope_setting.message)
    end

    it 'should return 404048 if envelope is not found', rpdoc_example_key: 404048, rpdoc_example_name: 'setup envelope setting failed (envelope not found)' do
      @envelope.destroy
      post @path, params: @params.to_json, headers: @headers
      expect(response).to have_http_status(404)
      expect(json['error_code']).to eq(404048)
      expect(json['error_key']).to eq('envelope_not_found')
    end

    it 'should return 400003 if invalid member', rpdoc_example_key: 400003, rpdoc_example_name: 'setup envelope setting failed (invalid member)', skip_auth: true do
      @headers['Authorization'] = 'Bearer invalid-token'
      post @path, params: @params.to_json, headers: @headers
      expect(response).to have_http_status(400)
      expect(json['error_code']).to eq(400003)
      expect(json['error_key']).to eq('invalid_member')
    end
  end
end
