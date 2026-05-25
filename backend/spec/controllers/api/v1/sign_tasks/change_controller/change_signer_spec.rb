
require 'rails_helper'

RSpec.describe Api::V1::SignTasks::ChangeController, type: :request do
  include_context 'rpdoc'

  before(:each) do |example|
    example.metadata[:rpdoc_action_key] = 'change_signer'
    example.metadata[:rpdoc_action_name] = 'change signer'
    example.metadata[:rpdoc_example_folders] = ['v1', 'sign_tasks', 'change']

    build_test_members
    @member = mock_member(:member_me, skip_auth: example.metadata[:skip_auth])
    @headers = {
      'Content-Type' => 'application/json',
      'Authorization' => 'Bearer {{rabbit_token}}'
    }
    @path = '/api/v1/sign_tasks/change_signer'
  end

  describe '#change_signer' do
    context '[sign task]' do
      before(:each) do
        @task = FactoryBot.create(:waiting_for_me1)
        @params = {
          sign_task_id: @task.id,
          stage_id: @task.processing_stages[0].id,
          new_signer: {
            name: @bella.name,
            email: @bella.email
          },
          reason: 'reason'
        }
      end

      it 'should return 200 and change signer success', rpdoc_example_key: 200, rpdoc_example_name: '[200] change signer success' do
        put @path, params: @params.to_json, headers: @headers
        @task.reload
        expect(response).to have_http_status(200)
        expect(@task.processing_stages[0].actor).to eq(@bella)
      end

      it 'should return 200 when change non-member to be new signer and setup locale success', rpdoc_example_key: 200_1, rpdoc_example_name: '[200_1] change signer and locale success' do
        @bella.update(is_registered: false)
        @params[:new_signer][:lang] = 'en'
        put @path, params: @params.to_json, headers: @headers

        @task.reload
        expect(response).to have_http_status(200)
        expect(@task.processing_stages[0].actor).to eq(@bella)
        expect(@task.processing_stages[0].stage_setting.specified_lang).to eq('en')
      end

      it 'should return 200 when change member to be new signer and setup locale success', rpdoc_example_key: 200_2, rpdoc_example_name: '[200_2] change signer and locale success' do
        # bella is registered member and locale is zh-TW
        @params[:new_signer][:lang] = 'en'
        put @path, params: @params.to_json, headers: @headers

        @task.reload
        expect(response).to have_http_status(200)
        expect(@task.processing_stages[0].actor).to eq(@bella)
        expect(@task.processing_stages[0].actor.profile.language).to eq('zh-TW')
      end

      it 'should return 200 and change signer with phone success', rpdoc_example_key: 200_3, rpdoc_example_name: 'change signer with phone success' do
        task = FactoryBot.create(:signer_need_otp_task)
        task.processing_stages[0].update(actor_name: "test")
        task.processing_stages[0].verify_methods.first.update(verify_type: "sms", verify_source: "+886-912345678")
        params = {
          sign_task_id: task.id,
          stage_id: task.processing_stages[0].id,
          new_signer: {
            name: @bella.name,
            email: @bella.email,
            phone: "+886-912345677"
          },
          reason: 'reason'
        }
        put @path, params: params.to_json, headers: @headers
        @task.reload
        expect(response).to have_http_status(200)
        expect(task.processing_stages[0].verify_methods.find_by(verify_type: "sms").verify_source).to eq(params[:new_signer][:phone])
      end

      it 'should return 400046 if stage is not processing', rpdoc_example_key: 400046, rpdoc_example_name: 'change signer failed (stage not processing)' do
        @params[:stage_id] = @task.sign_stages[0].id
        put @path, params: @params.to_json, headers: @headers
        expect(response).to have_http_status(400)
        expect(json['error_code']).to eq(400046)
      end

      it 'should return 403038 if stage had reviewed', rpdoc_example_key: 403038, rpdoc_example_name: 'change signer failed (stage had reviewed)' do
        task = FactoryBot.create(:waiting_for_me_modify1)
        @params[:sign_task_id] = task.id
        @params[:stage_id] = task.stages[1].id
        put @path, params: @params.to_json, headers: @headers
        expect(response).to have_http_status(403)
        expect(json['error_code']).to eq(403038)
        expect(json['error_key']).to eq('forward_not_allowed')
      end

      it 'should return 403038 if forward is not allowed', rpdoc_example_key: 403038, rpdoc_example_name: 'change signer failed (forward not allowed)' do
        task = FactoryBot.create(:waiting_for_me2)
        task.processing_stages[0].stage_setting.update_column(:forward_enable, false)
        @params[:stage_id] = task.processing_stages[0].id
        put @path, params: @params.to_json, headers: @headers
        expect(response).to have_http_status(403)
        expect(json['error_code']).to eq(403038)
        expect(json['error_key']).to eq('forward_not_allowed')
      end

      it 'should return 400003 if invalid member', rpdoc_example_key: 400003, rpdoc_example_name: 'change signer failed (invalid member)', skip_auth: true do
        @headers['Authorization'] = 'Bearer invalid-token'
        put @path, params: @params.to_json, headers: @headers
        expect(response).to have_http_status(400)
        expect(json['error_code']).to eq(400003)
        expect(json['error_key']).to eq('invalid_member')
      end
    end

    context '[envelope]' do
      before(:each) do
        @envelope = FactoryBot.create(:waiting_for_me_envelope)
        @params = {
          envelope_id: @envelope.id,
          stage_id: @envelope.processing_stages[0].id,
          new_signer: {
            name: @bella.name,
            email: @bella.email
          },
          reason: 'reason'
        }
      end

      it 'should return 200 and change signer success', rpdoc_example_key: 200_4, rpdoc_example_name: 'change signer success' do
        put @path, params: @params.to_json, headers: @headers
        @envelope.reload
        expect(response).to have_http_status(200)
        expect(@envelope.processing_stages[0].actor).to eq(@bella)
      end

      it 'should return 200 when change non-member to be new signer and setup locale success', rpdoc_example_key: 200_5, rpdoc_example_name: 'change to non-member signer and locale success' do
        @bella.update(is_registered: false)
        @params[:new_signer][:lang] = 'en'
        put @path, params: @params.to_json, headers: @headers
  
        @envelope.reload
        expect(response).to have_http_status(200)
        expect(@envelope.processing_stages[0].actor).to eq(@bella)
        expect(@envelope.processing_stages[0].stage_setting.specified_lang).to eq('en')
      end

      it 'should return 200 when change member to be new signer and setup locale success', rpdoc_example_key: 200_6, rpdoc_example_name: 'change to member signer and locale success' do
        # bella is registered member and locale is zh-TW
        @params[:new_signer][:lang] = 'en'
        put @path, params: @params.to_json, headers: @headers

        @envelope.reload
        expect(response).to have_http_status(200)
        expect(@envelope.processing_stages[0].actor).to eq(@bella)
        expect(@envelope.processing_stages[0].actor.profile.language).to eq('zh-TW')
      end

      it 'should return 200 and change signer with phone success', rpdoc_example_key: 200_7, rpdoc_example_name: 'change signer with phone success' do
        envelope = FactoryBot.create(:signer_need_otp_envelope)
        envelope.reload
        actor_info = envelope.processing_stages[0].actor_info.merge(name: "test")
        envelope.processing_stages[0].update(actor_info: actor_info)
        envelope.sign_tasks.each do |task|
          task.processing_stages[0].update(actor_name: "test")
          task.processing_stages[0].verify_methods.first.update(verify_type: "sms", verify_source: "+886-912345678")
        end

        params = {
          envelope_id: envelope.id,
          stage_id: envelope.processing_stages[0].id,
          new_signer: {
            name: @bella.name,
            email: @bella.email,
            phone: "+886-912345677"
          },
          reason: 'reason'
        }
        put @path, params: params.to_json, headers: @headers
        envelope.reload
        expect(response).to have_http_status(200)
        expect(envelope.sign_stages.processing[0].verify_methods.find_by(verify_type: "sms").verify_source).to eq(params[:new_signer][:phone])
      end

      it 'should return 400001 when required parameter is missing', rpdoc_example_key: 400001, rpdoc_example_name: 'change signer failed (missing required parameter)' do
        put @path, params: @params.except(:envelope_id).to_json, headers: @headers
        expect(response).to have_http_status(400)
        expect(json['error_code']).to eq(400001)
        expect(json['error_key']).to eq('need_more_information')
      end

      it 'should return 400046 if stage is not waiting', rpdoc_example_key: 400046_2, rpdoc_example_name: 'change signer failed (stage not waiting)' do
        @params[:stage_id] = @envelope.stages[0].id
        put @path, params: @params.to_json, headers: @headers
        expect(response).to have_http_status(400)
        expect(json['error_code']).to eq(400046)
      end

      it 'should return 403038 if forward is not allowed', rpdoc_example_key: 403038_2, rpdoc_example_name: 'change signer failed (forward not allowed)' do
        envelope = FactoryBot.create(:waiting_for_me_envelope2)
        envelope.processing_stages[0].stage_setting.update_column(:forward_enable, false)
        @params[:stage_id] = envelope.processing_stages[0].id
        put @path, params: @params.to_json, headers: @headers
        expect(response).to have_http_status(403)
        expect(json['error_code']).to eq(403038)
        expect(json['error_key']).to eq('forward_not_allowed')
      end

      it 'should return 400003 if invalid member', rpdoc_example_key: 400003, rpdoc_example_name: 'change signer failed (invalid member)', skip_auth: true do
        @headers['Authorization'] = 'Bearer invalid-token'
        put @path, params: @params.to_json, headers: @headers
        expect(response).to have_http_status(400)
        expect(json['error_code']).to eq(400003)
        expect(json['error_key']).to eq('invalid_member')
      end
    end
  end

end
