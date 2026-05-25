require 'rails_helper'

RSpec.describe Api::V1::SignTasks::KioskController, type: :request do
  include_context 'rpdoc'

  before(:each) do |example|
    example.metadata[:rpdoc_action_key] = 'verify'
    example.metadata[:rpdoc_action_name] = '驗證並查看臨櫃簽署任務'
    example.metadata[:rpdoc_example_folders] = ['v1', 'sign_tasks', 'kiosk']

    mock_upload
    @member = mock_member(:member_me)
    template = FactoryBot.create(:template, owner: @member)
    @task = mock_kiosk_task(template, @member)
    @headers = {
      'Authorization' => 'Bearer token',
      'Content-Type' => 'application/json'
    }
    @path = '/api/v1/sign_tasks/kiosk/verify'
  end

  describe '#verify' do
    before(:each) do
      @params = {
        sign_task_id: @task.id,
        actor_info: {
          name: 'Kiosk Signer Name',
          email: 'kiosk@gmail.com',
          phone: '+0123456789'
        }
      }
      @params.merge!(@task.start_from)
    end

    it 'should return 200', rpdoc_example_key: 200, rpdoc_example_name: 'verify kiosk task success' do
      post @path, params: @params.to_json, headers: @headers
      expect(response).to have_http_status(200)
    end

    it 'should return 400901 if signer info not ready', rpdoc_example_key: 400901_1, rpdoc_example_name: 'verify kiosk task failed (signer info not ready)' do
      @params.delete(:actor_info)
      post @path, params: @params.to_json, headers: @headers
      expect(response).to have_http_status(400)
      expect(json['error_code']).to eq(400901)
      expect(json['error_key']).to eq('signer_info_not_ready')
    end

    it 'should return 400901 if signer info not ready', rpdoc_example_key: 400901_2, rpdoc_example_name: 'verify kiosk task failed (signer info not ready, required field not provide)' do
      @params[:actor_info].delete(:email)
      post @path, params: @params.to_json, headers: @headers
      expect(response).to have_http_status(400)
      expect(json['error_code']).to eq(400901)
      expect(json['error_key']).to eq('signer_info_not_ready')
    end

  end

end
