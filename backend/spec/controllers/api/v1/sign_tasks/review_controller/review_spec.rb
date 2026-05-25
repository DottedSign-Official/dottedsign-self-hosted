require 'rails_helper'

RSpec.describe Api::V1::SignTasks::ReviewController, type: :request do
  include_context 'rpdoc'

  before(:each) do |example|
    example.metadata[:rpdoc_action_key] = 'review'
    example.metadata[:rpdoc_action_name] = 'review'
    example.metadata[:rpdoc_example_folders] = ['v1', 'sign_tasks', 'review']

    @path = '/api/v1/sign_tasks/review'
    @params = {
      client: 'web',
      ip_address: '127.0.0.1',
      user_agent: 'RSpec',
      work_id: 'work_id'
    }
    mock_headers
  end

  describe '#review' do
    context '[normal review]' do
      before(:each) do |example|
        @member = mock_member(:member_me, skip_auth: example.metadata[:skip_auth])
        @task = FactoryBot.create(:waiting_for_me_review1)
        @base_stage = @task.stages.first
        @base_stage.stage_setting.update(reviewed_skip_confirm: false)
        @params.merge!({
          sign_task_id: @task.id,
          review_fields: @base_stage.field_settings.map { |field_setting| { field_object_id: field_setting.field_object_id, accepted: example.metadata[:pass] } },
          review_attachments: @base_stage.attachments.map { |attachment| { attachment_id: attachment.label, accepted: example.metadata[:pass] } }
        })
      end

      it 'should return 200 if review pass success', pass: true, rpdoc_example_key: '200_pass', rpdoc_example_name: 'review pass success' do
        post @path, params: @params.to_json, headers: @headers
        expect(response).to have_http_status(200)

        @task.reload
        expect(@task.stages.first.status).to eq('reviewed')
        expect(@task.stages.second.status).to eq('done')
        expect(@task.stages.second.review_logs.count).to eq(1)
        expect(@task.stages.second.review_logs.first.sign_event.action_name).to eq('review_passed')
      end

      it 'should return 200 if review reject success', pass: false, rpdoc_example_key: '200_reject', rpdoc_example_name: 'review reject success' do
        @params[:review_message] = 'reject message'
        post @path, params: @params.to_json, headers: @headers
        expect(response).to have_http_status(200)

        @task.reload
        expect(@task.stages.first.status).to eq('modifying')
        expect(@task.stages.second.status).to eq('initial')
        expect(@task.stages.second.review_logs.count).to eq(1)
        expect(@task.stages.second.review_logs.first.reviewed_message).to eq('reject message')
        expect(@task.stages.second.review_logs.first.sign_event.action_name).to eq('review_rejected')
      end
    end

    context '[quick review]' do
      before(:each) do |example|
        @member = mock_member(:not_register_member, skip_auth: true)
        @task = FactoryBot.create(:quick_sign_waiting_for_review_task)
        @base_stage = @task.stages.first
        @params.merge!({
          code: mock_preview_code_accepted(@task, @task.stages.second),
          review_fields: @base_stage.field_settings.map { |field_setting| { field_object_id: field_setting.field_object_id, accepted: example.metadata[:pass] } },
          review_attachments: @base_stage.attachments.map { |attachment| { attachment_id: attachment.label, accepted: example.metadata[:pass] } }
        })
        mock_headers(with_token: false)
      end

      it 'should return 200 if quick review pass success', pass: true, rpdoc_example_key: '200_quick_pass', rpdoc_example_name: 'quick review pass success' do
        post @path, params: @params.to_json, headers: @headers
        expect(response).to have_http_status(200)
      end
    end
  end
end
