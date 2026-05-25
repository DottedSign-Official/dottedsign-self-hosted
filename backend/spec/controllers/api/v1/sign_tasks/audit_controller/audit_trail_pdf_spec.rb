require 'rails_helper'

RSpec.describe Api::V1::SignTasks::AuditController, type: :request do
  include_context 'rpdoc'

  before(:each) do |example|
    example.metadata[:rpdoc_action_key] = 'audit_trail_pdf'
    example.metadata[:rpdoc_action_name] = 'get task audit trail pdf'
    example.metadata[:rpdoc_example_folders] = ['v1', 'sign_tasks', 'audit']
    mock_download
    @member = mock_member(:member_me, skip_auth: example.metadata[:skip_auth])
    @headers = {
      'Authorization' => 'Bearer {{rabbit_token}}'
    }
    @path = '/api/v1/sign_tasks/audit_trail_pdf'
  end

  describe '#audit_trail_pdf' do
    context '[sign task]' do
      before(:each) do
        @task = FactoryBot.create(:completed_task1)
        @params = {
          sign_task_id: @task.id
        }
      end

      it 'should return 200 if task is completed', rpdoc_example_key: 200, rpdoc_example_name: 'get task audit trail pdf success' do
        get "#{@path}?#{URI.encode_www_form(@params)}", headers: @headers
        expect(response).to have_http_status(200)
        expect(response.headers['Content-Type']).to eq('application/pdf')
        expect(response.headers['Content-Disposition']).to include('attachment')
        expect(response.headers['Content-Disposition']).to include(@task.file_name)
      end

      it 'should return 400003 if invalid member', rpdoc_example_key: 400003, rpdoc_example_name: 'get audit trail pdf failed (invalid member)', skip_auth: true do
        @headers['Authorization'] = 'Bearer invalid-token'
        get "#{@path}?#{URI.encode_www_form(@params)}", headers: @headers
        expect(response).to have_http_status(400)
        expect(json['error_code']).to eq(400003)
        expect(json['error_key']).to eq('invalid_member')
      end

      it 'should return 400063 if task is not completed', rpdoc_example_key: 400063, rpdoc_example_name: 'get audit trail pdf failed (task not complete)' do
        task = FactoryBot.create(:waiting_for_me1)
        @params[:sign_task_id] = task.id
        get "#{@path}?#{URI.encode_www_form(@params)}", headers: @headers
        expect(response).to have_http_status(400)
        expect(json['error_code']).to eq(400063)
        expect(json['error_key']).to eq('task_is_not_finished')
      end

      include_examples 'group_access_invite_task_examples', 'get', 'download_audit_trail', 'complete'
    end

    context '[envelope]' do
      before(:each) do
        @envelope = FactoryBot.create(:completed_envelope)
        @params = {
          envelope_id: @envelope.id
        }
      end

      it 'should return 200 if envelope is completed', rpdoc_example_key: 200_2, rpdoc_example_name: 'get envelope audit trail pdf success' do
        get "#{@path}?#{URI.encode_www_form(@params)}", headers: @headers
        expect(response).to have_http_status(200)
        expect(response.headers['Content-Type']).to eq('application/zip')
        expect(response.headers['Content-Disposition']).to include('attachment')
        expect(response.headers['Content-Disposition']).to include("envelope.zip")
      end

      it 'should return 400074 if envelope is not completed', rpdoc_example_key: 400074, rpdoc_example_name: 'get audit trail pdf failed (envelope not complete)' do
        envelope = FactoryBot.create(:waiting_for_me_envelope)
        @params[:envelope_id] = envelope.id
        get "#{@path}?#{URI.encode_www_form(@params)}", headers: @headers
        expect(response).to have_http_status(400)
        expect(json['error_code']).to eq(400074)
        expect(json['error_key']).to eq('envelope_is_not_finished')
      end

      include_examples 'group_access_invite_envelope_examples', 'get', 'download_audit_trail', 'completed'
    end
  end

end
