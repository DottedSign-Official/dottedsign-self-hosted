require 'rails_helper'

RSpec.describe Api::V1::SignTasks::ReviewController, type: :request do
  include_context 'rpdoc'

  before(:each) do |example|
    example.metadata[:rpdoc_action_key] = 'confirm'
    example.metadata[:rpdoc_action_name] = 'confirm'
    example.metadata[:rpdoc_example_folders] = ['v1', 'sign_tasks', 'review']

    @path = '/api/v1/sign_tasks/confirm'
    @params = {
      client: 'web',
      ip_address: '127.0.0.1',
      user_agent: 'RSpec',
      work_id: 'work_id'
    }
    mock_headers
  end

  describe '#confirm' do
    context '[normal confirm]' do
      before(:each) do |example|
        @member = mock_member(:member_me, skip_auth: example.metadata[:skip_auth])
        @task = FactoryBot.create(:waiting_for_me_confirm1)
        @params[:sign_task_id] = @task.id
      end

      it 'should return 200 if confirm success', pass: true, rpdoc_example_key: '200', rpdoc_example_name: 'confirm success' do
        post @path, params: @params.to_json, headers: @headers
        expect(response).to have_http_status(200)
      end

      it 'should return 403_034 if signer with review still need verify', rpdoc_example_key: '403_034_normal_confirm_with_verify', rpdoc_example_name: '[normal confirm] confirm the task failed (stage_need_verify)' do
        allow(DigitalCertificate::Gra).to receive(:auth_ca).and_return({ 'result' => 1, 'tid' => 'gra_tid' })
        @task = FactoryBot.create(:signer_need_otp_confirm_task, verify_type: 'cht_personal')
        @params[:sign_task_id] = @task.id
        post @path, params: @params.to_json, headers: @headers
        expect(response).to have_http_status(403)
        expect(json['error_code']).to eq(403_034)
        expect(json['error_key']).to eq('stage_need_verify')
      end
    end

    context '[quick confirm]' do
      before(:each) do |example|
        @member = mock_member(:not_register_member, skip_auth: true)
        @task = FactoryBot.create(:quick_sign_waiting_for_confirm_task)
        @params[:code] = mock_preview_code_accepted(@task, @task.stages.first)
        mock_headers(with_token: false)
      end

      it 'should return 200 if quick confirm success', pass: true, rpdoc_example_key: '200_quick_confirm', rpdoc_example_name: 'quick confirm success' do
        post @path, params: @params.to_json, headers: @headers
        expect(response).to have_http_status(200)
      end
    end
  end
end
