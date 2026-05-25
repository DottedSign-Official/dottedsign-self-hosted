require 'rails_helper'

RSpec.describe Api::V1::SignTasks::AuditController, type: :request do
  include_context 'rpdoc'

  before(:each) do |example|
    example.metadata[:rpdoc_action_key] = 'audit_trail'
    example.metadata[:rpdoc_action_name] = 'get task audit trail'
    example.metadata[:rpdoc_example_folders] = ['v1', 'sign_tasks', 'audit']

    @member = mock_member(:member_me, skip_auth: example.metadata[:skip_auth])
    @headers = {
      'Authorization' => 'Bearer {{rabbit_token}}'
    }
    @path = '/api/v1/sign_tasks/audit_trail'
  end

  describe '#audit_trail' do
    it 'should return 200 and get audit_trail content', rpdoc_example_key: 200, rpdoc_example_name: 'get task audit_trail content success' do
      task = FactoryBot.create(:completed_task1)
      get "#{@path}?#{URI.encode_www_form(sign_task_id: task.id)}"
      expect(response).to have_http_status(200)
      expect(json['data']['audit_trail'].first).to have_key('event_date')
      expect(json['data']['audit_trail'].first).to have_key('event_time')
      expect(json['data']['audit_trail'].first).to have_key('action_name')
      expect(json['data']['audit_trail'].first).to have_key('role')
      expect(json['data']['audit_trail'].first).to have_key('ip_address')
      expect(json['data']['audit_trail'].first).to have_key('device')
      expect(json['data']['audit_trail'].first).to have_key('sign_mode')
    end

    it 'should return 200 and get audit_trail content', rpdoc_example_key: 200_2, rpdoc_example_name: 'get envelope audit_trail content success' do
      envelope = FactoryBot.create(:completed_envelope)
      get "#{@path}?#{URI.encode_www_form(envelope_id: envelope.id)}"
      expect(response).to have_http_status(200)
      expect(json['data']['audit_trail'].first).to have_key('event_date')
      expect(json['data']['audit_trail'].first).to have_key('event_time')
      expect(json['data']['audit_trail'].first).to have_key('action_name')
      expect(json['data']['audit_trail'].first).to have_key('role')
      expect(json['data']['audit_trail'].first).to have_key('ip_address')
      expect(json['data']['audit_trail'].first).to have_key('device')
      expect(json['data']['audit_trail'].first).to have_key('sign_mode')
    end

    it 'should return 200 and get audit_trail content', rpdoc_example_key: 200_3, rpdoc_example_name: 'get form task audit_trail content success' do
      form_task = FactoryBot.create(:completed_form_task)
      get "#{@path}?#{URI.encode_www_form(sign_task_id: form_task.id)}"
      expect(response).to have_http_status(200)
      signed_roles = json['data']['audit_trail'].filter_map { |entry| entry['role'] if entry['action_name'] == 'Signed' }
      expect(signed_roles).to include(form_task.stages.action_form_sign.first.actor_display_email)
    end

    it 'should return 400003 if invalid member', rpdoc_example_key: 400003, rpdoc_example_name: 'get audit_trail content failed (invalid member)', skip_auth: true do
      @headers['Authorization'] = 'Bearer invalid-token'
      task = FactoryBot.create(:completed_task1)
      get "#{@path}?#{URI.encode_www_form(sign_task_id: task.id)}", headers: @headers
      expect(response).to have_http_status(400)
      expect(json['error_code']).to eq(400003)
      expect(json['error_key']).to eq('invalid_member')
    end
  end

end
