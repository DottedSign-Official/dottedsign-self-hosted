require 'rails_helper'

RSpec.describe Api::V1::SignTasks::InfoController, type: :request do
  include_context 'rpdoc'

  before(:each) do |example|
    example.metadata[:rpdoc_action_key] = 'download'
    example.metadata[:rpdoc_action_name] = 'download task'
    example.metadata[:rpdoc_example_folders] = ['v1', 'sign_tasks', 'info']

    @member = mock_member(:member_me, skip_auth: example.metadata[:skip_auth])
    @headers = {'Authorization' => 'Bearer {{rabbit_token}}'}
    @path = '/api/v1/sign_tasks/download'
    mock_download
  end

  describe '#download' do
    context '[normal download]' do
      before(:each) do
        @task = FactoryBot.create(:waiting_for_me1)
        @params = {
          sign_task_id: @task.id
        }
      end

      it 'should return 200', rpdoc_example_key: 200, rpdoc_example_name: 'download task success' do
        get "#{@path}?#{URI.encode_www_form(@params)}", headers: @headers
        expect(response).to have_http_status(200)
      end

      it 'should return 403036 (task not related)', rpdoc_example_key: 403036, rpdoc_example_name: 'download task failed (task not related)' do
        task = FactoryBot.create(:not_related)
        @params[:sign_task_id] = task.id
        get "#{@path}?#{URI.encode_www_form(@params)}", headers: @headers
        expect(response).to have_http_status(403)
        expect(json['error_code']).to eq(403036)
        expect(json['error_key']).to eq('task_not_accessible')
      end

      it 'should return 400003 if invalid member', rpdoc_example_key: 400003, rpdoc_example_name: 'download task failed (invalid member)', skip_auth: true do
        @headers['Authorization'] = 'Bearer invalid-token'
        get "#{@path}?#{URI.encode_www_form(@params)}", headers: @headers
        expect(response).to have_http_status(400)
        expect(json['error_code']).to eq(400003)
        expect(json['error_key']).to eq('invalid_member')
      end

      include_examples 'group_access_invite_task_examples', 'get', 'download_completed_task', 'complete'
      include_examples 'group_access_invite_task_examples', 'get', 'download_processing_task', 'waiting'
      include_examples 'group_access_self_task_examples', 'get', 'download_sign_and_send'
    end

    context '[envelope download]' do
      before(:each) do
        @envelope = FactoryBot.create(:waiting_for_me_envelope)
        @params = {
          envelope_id: @envelope.id
        }
      end

      it 'should return 200', rpdoc_example_key: 200, rpdoc_example_name: 'download envelope success' do
        get "#{@path}?#{URI.encode_www_form(@params)}", headers: @headers
        expect(response).to have_http_status(200)
      end

      it 'should return 403067 (envelope not related)', rpdoc_example_key: 403067, rpdoc_example_name: 'download envelope failed (envelope not related)' do
        envelope = FactoryBot.create(:not_related_envelope)
        @params[:envelope_id] = envelope.id
        get "#{@path}?#{URI.encode_www_form(@params)}", headers: @headers
        expect(response).to have_http_status(403)
        expect(json['error_code']).to eq(403067)
        expect(json['error_key']).to eq('envelope_not_accessible')
      end

      include_examples 'group_access_invite_envelope_examples', 'get', 'download_completed_task', 'completed'
      include_examples 'group_access_invite_envelope_examples', 'get', 'download_processing_task', 'waiting'
    end
  end
end
