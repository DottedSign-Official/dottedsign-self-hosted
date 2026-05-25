require 'rails_helper'

RSpec.describe Api::V1::SignTasks::ChangeController, type: :request do
  include_context 'rpdoc'

  before(:each) do |example|
    example.metadata[:rpdoc_action_key] = 'change_task_name'
    example.metadata[:rpdoc_action_name] = 'change task name'
    example.metadata[:rpdoc_example_folders] = ['v1', 'sign_tasks', 'change']

    build_test_members
    @member = mock_member(:member_me, skip_auth: example.metadata[:skip_auth])
    @headers = {
      'Content-Type' => 'application/json',
      'Authorization' => 'Bearer {{rabbit_token}}'
    }
    @path = '/api/v1/sign_tasks/change_task_name'
  end

  describe '#change_task_name' do
    context '[sign task]' do
      before(:each) do
        mock_http_send
        @task = FactoryBot.create(:waiting_for_me1)
        @params = {
          sign_task_id: @task.id,
          file_name: 'New File Name'
        }
      end

      it 'should return 200 and change task name success', rpdoc_example_key: 200, rpdoc_example_name: 'change task name success' do
        put @path, params: @params.to_json, headers: @headers

        @task.reload
        expect(response).to have_http_status(200)
        expect(@task.file_name).to eq(@params[:file_name])
      end

      it 'should return 403033 if member not owner of task', rpdoc_example_key: 403033, rpdoc_example_name: 'change task name failed (member not owner of task)' do
        mock_member(:member_a)
        put @path, params: @params.to_json, headers: @headers
        expect(response).to have_http_status(403)
        expect(json['error_code']).to eq(403033)
        expect(json['error_key']).to eq('task_not_owned')
      end

      it 'should return 400003 if invalid member', rpdoc_example_key: 400003, rpdoc_example_name: 'change task name failed (invalid member)', skip_auth: true do
        @headers['Authorization'] = 'Bearer invalid-token'
        put @path, params: @params.to_json, headers: @headers
        expect(response).to have_http_status(400)
        expect(json['error_code']).to eq(400003)
        expect(json['error_key']).to eq('invalid_member')
      end
    end

    context '[envelope]' do
      before(:each) do
        mock_http_send
        @envelope = FactoryBot.create(:waiting_for_me_envelope)
        @params = {
          envelope_id: @envelope.id,
          file_name: 'New Envelope Name'
        }
      end

      it 'should return 200 and change envelope name success', rpdoc_example_key: 200_2, rpdoc_example_name: 'change envelope name success' do
        put @path, params: @params.to_json, headers: @headers

        @envelope.reload
        expect(response).to have_http_status(200)
        expect(@envelope.envelope_name).to eq(@params[:file_name])
      end

      it 'should return 403065 if member not owner of envelope', rpdoc_example_key: 403065, rpdoc_example_name: 'change envelope name failed (member not owner of envelope)' do
        mock_member(:member_a)
        put @path, params: @params.to_json, headers: @headers
        expect(response).to have_http_status(403)
        expect(json['error_code']).to eq(403065)
        expect(json['error_key']).to eq('envelope_not_owned')
      end
    end
  end

end
