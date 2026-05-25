require 'rails_helper'

RSpec.describe Api::V1::SignTasks::DeclineController, type: :request do
  include_context 'rpdoc'

  before(:each) do |example|
    example.metadata[:rpdoc_action_key] = 'decline'
    example.metadata[:rpdoc_action_name] = '拒絕簽署任務'
    example.metadata[:rpdoc_example_folders] = ['v1', 'sign_tasks', 'decline']

    @member = mock_member(:member_me, skip_auth: example.metadata[:skip_auth])
    mock_http_send
    mock_decline_reasons
    @headers = {
      'Authorization' => 'Bearer {{rabbit_token}}',
      'Content-Type' => 'application/json'
    }
    @path = '/api/v1/sign_tasks/decline'
  end

  describe '#decline' do
    context '[sign task normal]' do
      before(:each) do
        @task = FactoryBot.create(:waiting_for_me2)
        @params = {
          decline_reason_id: DeclineReason.first.id,
          sign_task_id: @task.id,
          reply_to: ['test2@test.com'],
          reason: 'want to decline task'
        }
      end

      it 'should return 200 if task is waiting for me now', rpdoc_example_key: 200, rpdoc_example_name: 'decline task success' do
        post @path, params: @params.to_json, headers: @headers
        expect(response).to have_http_status(200)
        @task.reload
        expect(@task.status).to eq('declined')
        expect(@task.decline_log&.decline_reason_id).to eq(DeclineReason.first.id)
        expect(@task.decline_log&.reason).to eq(@params[:reason])
      end

      it 'should create decline log', rpdoc_skip: true do
        expect{post @path, params: @params.to_json, headers: @headers}.to change{DeclineLog.count}.by(1)
      end

      it 'should return 403049 if task not declineable (task owned by me)', rpdoc_example_key: 403049_1, rpdoc_example_name: 'decline task failed (task owned by me)' do
        task = FactoryBot.create(:waiting_for_me1)
        @params[:sign_task_id] = task.id
        post @path, params: @params.to_json, headers: @headers
        expect(response).to have_http_status(403)
        expect(json['error_code']).to eq(403049)
      end

      it 'should return 403049 if task not declineable (stage not decline_enable)', rpdoc_example_key: 403049_2, rpdoc_example_name: 'decline task failed (stage not decline_enable)' do
        @task.processing_stages[0].stage_setting.update_column(:decline_enable, false)
        post @path, params: @params.to_json, headers: @headers
        expect(response).to have_http_status(403)
        expect(json['error_code']).to eq(403049)
      end
    end

    context '[sign task quick]' do
      before(:each) do
        @quick_sign_task = FactoryBot.create(:quick_sign_task)
        @preview_code = @quick_sign_task.original_file.preview_code(@quick_sign_task.sign_stages.processing.first)
        @params = {
          decline_reason_id: DeclineReason.first.id,
          sign_task_id: @quick_sign_task.id,
          reply_to: ["#{@quick_sign_task.owner.email}"],
          reason: 'want to decline task',
          work_id: 'work_id',
          code: @preview_code,
          ip_address: '127.0.0.1',
          client: 'web'
        }

        @cache_key = "#{@preview_code}:quick_sign_accept"
        @headers = { 'Content-Type' => 'application/json' }
        @cache_value = {
          accepted_at: Time.zone.now.to_i,
          client: 'web',
          ip_address: '127.0.0.1',
          work_id: 'work_id'
        }
        Rails.cache.write(@cache_key, @cache_value, expires_in: ServiceFile::PREVIEW_EXPIRED_IN)
      end

      it 'should return 200 if quick signer decline task', rpdoc_example_key: 200_1, rpdoc_example_name: '[quick] decline task success', skip_auth: true do
        allow_any_instance_of(SignStage).to receive(:stage_file).and_return({})
        post @path, params: @params.to_json, headers: @headers
        @quick_sign_task.reload
        expect(response).to have_http_status(200)
        expect(@quick_sign_task.status).to eq('declined')
        expect(@quick_sign_task.decline_log&.decline_reason_id).to eq(DeclineReason.first.id)
        expect(@quick_sign_task.decline_log&.reason).to eq(@params[:reason])
      end
    end

    context '[envelope normal]' do
      before(:each) do
        @envelope = FactoryBot.create(:waiting_for_me_envelope2)
        @params = {
          decline_reason_id: DeclineReason.first.id,
          envelope_id: @envelope.id,
          reply_to: ['test2@test.com'],
          reason: 'want to decline envelope'
        }
      end

      it 'should return 200 if envelope is waiting for me now', rpdoc_example_key: 200_2, rpdoc_example_name: 'decline envelope success' do
        post @path, params: @params.to_json, headers: @headers
        @envelope.reload
        expect(response).to have_http_status(200)
        expect(@envelope.status).to eq('declined')
        expect(@envelope.decline_log&.decline_reason_id).to eq(DeclineReason.first.id)
        expect(@envelope.decline_log&.reason).to eq(@params[:reason])
      end

      it 'should create decline log', rpdoc_skip: true do
        expect { post @path, params: @params.to_json, headers: @headers }.to change { DeclineLog.count }.by(2)
      end

      it 'should return 403049 if envelope not declinable (envelope owned by me)', rpdoc_example_key: 403049_3, rpdoc_example_name: 'decline envelope failed (envelope owned by me)' do
        envelope = FactoryBot.create(:waiting_for_me_envelope)
        @params[:envelope_id] = envelope.id
        post @path, params: @params.to_json, headers: @headers
        expect(response).to have_http_status(403)
        expect(json['error_code']).to eq(403049)
      end

      it 'should return 403049 if envelope not declinable (stage not decline_enable)', rpdoc_example_key: 403049_4, rpdoc_example_name: 'decline envelope failed (stage not decline_enable)' do
        @envelope.processing_stages[0].stage_setting.update_column(:decline_enable, false)
        post @path, params: @params.to_json, headers: @headers
        expect(response).to have_http_status(403)
        expect(json['error_code']).to eq(403049)
      end
    end

    context '[envelope quick]' do
      before(:each) do
        @quick_sign_envelope = FactoryBot.create(:quick_sign_envelope)
        @preview_code = @quick_sign_envelope.original_file.preview_code(@quick_sign_envelope.processing_stages.first)
        @params = {
          decline_reason_id: DeclineReason.first.id,
          envelope_id: @quick_sign_envelope.id,
          reply_to: ["#{@quick_sign_envelope.owner.email}"],
          reason: 'want to decline envelope',
          work_id: 'work_id',
          code: @preview_code,
          ip_address: '127.0.0.1',
          client: 'web'
        }

        @cache_key = "#{@preview_code}:quick_sign_accept"
        @headers = { 'Content-Type' => 'application/json' }
        @cache_value = {
          accepted_at: Time.zone.now.to_i,
          client: 'web',
          ip_address: '127.0.0.1',
          work_id: 'work_id'
        }
        Rails.cache.write(@cache_key, @cache_value, expires_in: ServiceFile::PREVIEW_EXPIRED_IN)
      end

      it 'should return 200 if quick signer decline envelope', rpdoc_example_key: 200_3, rpdoc_example_name: '[quick] decline envelope success', skip_auth: true do
        # allow_any_instance_of(SignStage).to receive(:stage_file).and_return({})
        post @path, params: @params.to_json, headers: @headers
        @quick_sign_envelope.reload
        expect(response).to have_http_status(200)
        expect(@quick_sign_envelope.status).to eq('declined')
        expect(@quick_sign_envelope.decline_log&.decline_reason_id).to eq(DeclineReason.first.id)
        expect(@quick_sign_envelope.decline_log&.reason).to eq(@params[:reason])
      end
    end
  end
end
