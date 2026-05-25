require 'rails_helper'

RSpec.describe Api::V1::TaskSettingsController, type: :request do
  include_context 'rpdoc'

  before(:each) do |example|
    example.metadata[:rpdoc_action_key] = 'setup'
    example.metadata[:rpdoc_action_name] = 'setup task setting'
    example.metadata[:rpdoc_example_folders] = ['v1', 'task_settings']

    @member = mock_member(:member_me, skip_auth: example.metadata[:skip_auth])
    @headers = {
      'Content-Type' => 'application/json',
      'Authorization' => 'Bearer {{rabbit_token}}'
    }
    @path = '/api/v1/task_settings/setup'
    @task = FactoryBot.create(:waiting_for_me1)
    @task_setting = @task.task_setting
  end

  describe '#setup' do
    before(:each) do
      @params = {
        sign_task_id: @task.id,
        need_otp_verify: true
      }
    end

    it 'should return 200', rpdoc_skip: true do
      post @path, params: @params.to_json, headers: @headers
      expect(response).to have_http_status(200)
    end

    it 'should update forget_remind and deadline', rpdoc_example_key: 200, rpdoc_example_name: 'setup task setting success' do
      @params[:forget_remind] = false
      @params[:deadline] = 2.weeks.after.to_i
      post @path, params: @params.to_json, headers: @headers
      expect(json['data']['forget_remind']).to eq(@params[:forget_remind])
      expect(json['data']['deadline']).to eq(@params[:deadline])
      expect(json['data']['message']).to eq(@task_setting.message)
      expect(json['data']['need_otp_verify']).to eq(@params[:need_otp_verify])
      expect(json['data']['receiver_lang']).to eq(@task_setting.receiver_lang)
    end

    it 'should return 404031 if task is not found', rpdoc_example_key: 404031, rpdoc_example_name: 'setup task setting failed (task not found)' do
      @task.destroy
      post @path, params: @params.to_json, headers: @headers
      expect(response).to have_http_status(404)
      expect(json['error_code']).to eq(404031)
    end

    it 'should return 400003 if invalid member', rpdoc_example_key: 400003, rpdoc_example_name: 'setup task setting failed (invalid member)', skip_auth: true do
      @headers['Authorization'] = 'Bearer invalid-token'
      post @path, params: @params.to_json, headers: @headers
      expect(response).to have_http_status(400)
      expect(json['error_code']).to eq(400003)
      expect(json['error_key']).to eq('invalid_member')
    end
  end
end
