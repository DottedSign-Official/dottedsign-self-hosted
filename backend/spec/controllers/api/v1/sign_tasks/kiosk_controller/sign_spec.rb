require 'rails_helper'

RSpec.describe Api::V1::SignTasks::KioskController, type: :request do
  include_context 'redis_cache'
  include_context 'rpdoc'

  before(:each) do |example|
    example.metadata[:rpdoc_action_key] = 'sign'
    example.metadata[:rpdoc_action_name] = '簽署臨櫃簽署任務'
    example.metadata[:rpdoc_example_folders] = ['v1', 'sign_tasks', 'kiosk']

    member = mock_member(:member_me)
    template = FactoryBot.create(:template, owner: member)
    @task = mock_kiosk_task(template, member)
    mock_kiosk_read(@task) unless example.metadata[:skip_read]
    mock_sign
    signature = FactoryBot.create(:guest_signature)
    @stage = @task.stages[0]
    @params = {
      sign_task_id: @task.id,
      signature_info: @stage.field_settings.map do |field_setting|
        {
          object_id: field_setting.field_object_id,
          type: field_setting.field_type,
          value: field_setting.field_type == 'guest_signature' ? signature.id : mock_field_value(field_setting.field_type),
        }
      end
    }
    @params.merge!(@task.start_from)
    @headers = {
      'Authorization' => 'Bearer token',
      'Content-Type' => 'application/json'
    }
    @path = '/api/v1/sign_tasks/kiosk/sign'
  end

  describe '#sign' do
    it 'should return 200', rpdoc_example_key: 200, rpdoc_example_name: 'sign kiosk task success' do
      put @path, params: @params.to_json, headers: @headers
      expect(response).to have_http_status(200)
    end

    it 'should return 400905 if kiosk not read before', skip_read: true, rpdoc_example_key: 400905, rpdoc_example_name: 'sign kiosk task failed (kiosk not read before)' do
      put @path, params: @params.to_json, headers: @headers
      expect(response).to have_http_status(400)
      expect(json['error_code']).to eq(400905)
      expect(json['error_key']).to eq('kiosk_not_read')
    end

    it 'should return 400901 if signer info not ready', rpdoc_example_key: 400901, rpdoc_example_name: 'sign kiosk task failed (signer info not ready, required field not provide)' do
      @task.dummy_stages.processing.first.update(actor_info: {})
      put @path, params: @params.to_json, headers: @headers
      expect(response).to have_http_status(400)
      expect(json['error_code']).to eq(400901)
      expect(json['error_key']).to eq('signer_info_not_ready')
    end

    it 'should return 400_062 with checkbox / radio group', rpdoc_example_key: 400062, rpdoc_example_name: 'sign kiosk task failed (with checkbox / radio group)' do |example|
      @stage.field_setting_groups[0].update(options: { force: true })
      put @path, params: @params.to_json, headers: @headers
      expect(response).to have_http_status(400)
      expect(json['error_code']).to eq(400_062)
      expect(json['error_key']).to eq('field_content_invalid')
    end
  end
end
