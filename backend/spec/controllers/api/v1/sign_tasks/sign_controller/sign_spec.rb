require 'rails_helper'

RSpec.describe Api::V1::SignTasks::SignController, type: :request do
  include_context 'redis_cache'
  include_context 'rpdoc'

  before(:each) do |example|
    example.metadata[:rpdoc_action_key] = 'sign'
    example.metadata[:rpdoc_action_name] = 'sign the task'
    example.metadata[:rpdoc_example_folders] = ['v1', 'sign_tasks', 'sign']

    @headers = {
      'Content-Type' => 'application/json'
    }
    @path = '/api/v1/sign_tasks/sign'
  end

  describe '#sign' do
    before(:each) do
      @params = {
        client: 'web',
        ip_address: '0.0.0.0',
        work_id: 'random_work_id',
        signature_info: []
      }
      mock_service(DataInsert)
      mock_opt_send
    end

    context '[quick sign]' do
      before(:each) do
        @task = FactoryBot.create(:quick_sign_task)
        @consent_path = '/api/v1/sign_tasks/consent'
        @params = @params.merge({
          check: true,
          code: @task.original_file.preview_code(@task.processing_stages[0], will_expired: true),
          sign_task_id: @task.id,
          verify_info: {
            sequence: 1,
            uuid: "uuid",
            verify_data: "123456"
          }
        })
      end

      it 'should return 200 and get sign task result if quick sign succeed', rpdoc_example_key: 200_1, rpdoc_example_name: '[quick sign] sign the task success' do
        allow_any_instance_of(SignStage).to receive(:stage_file).and_return({})
        post @consent_path, params: @params

        put @path, params: @params.to_json, headers: @headers
        expect(response).to have_http_status(200)
        expect(json['data']['task_id']).to eq(@task.id)
        expect(json['data']['after_sign_category']).to eq('completed')
      end

      it 'should return 200 if verify and quick sign succeed ', rpdoc_example_key: 200_2, rpdoc_example_name: '[quick sign] verify and sign the task success' do
        allow_any_instance_of(SignStage).to receive(:stage_file).and_return({})
        post @consent_path, params: @params

        params = @params.merge({
          verify_info: {
            sequence: 1,
            uuid: "uuid",
            verify_data: "123456"
          }
        })

        put @path, params: params.to_json, headers: @headers
        expect(response).to have_http_status(200)
        expect(json['data']['task_id']).to eq(@task.id)
        expect(json['data']['after_sign_category']).to eq('completed')
      end

      it 'should return 200 and get envelope result if quick sign succeed', rpdoc_example_key: 200_4, rpdoc_example_name: '[quick sign] sign the envelope success' do
        mock_stage_file
        envelope = FactoryBot.create(:quick_sign_envelope)
        params = @params.except(:sign_task_id).merge({
          code: envelope.original_file.preview_code(envelope.dummy_stages[0], will_expired: true),
          envelope_id: envelope.id
        })
        post @consent_path, params: params

        put @path, params: params.to_json, headers: @headers
        expect(response).to have_http_status(200)
        expect(json['data']['envelope_id']).to eq(envelope.id)
        expect(json['data']['after_sign_category']).to eq('completed')
      end

      it 'should return 403037 if user not consent before quick sign', rpdoc_example_key: 403037, rpdoc_example_name: '[quick sign] sign the task failed (user has not consent)' do
        put @path, params: @params.to_json, headers: @headers
        expect(response).to have_http_status(403)
        expect(json['error_code']).to eq(403037)
      end

      it 'should return 400061 if preview code invalid', rpdoc_example_key: 400061, rpdoc_example_name: '[quick sign] sign the task failed (preview code invalid)' do
        @params[:code] = 'invalid-preview-code'
        put @path, params: @params.to_json, headers: @headers
        expect(response).to have_http_status(400)
        expect(json['error_code']).to eq(400061)
        expect(json['error_key']).to eq('invalid_preview_code')
      end

      it 'should return 403_034 if stage need verify', rpdoc_example_key: 403_034, rpdoc_example_name: '[quick sign] 403_034(stage_need_verify)' do
        @member = mock_member(:not_register_member_need_otp, skip_auth: true)
        need_otp_task = FactoryBot.create(:quick_signer_need_otp_task, occassion: "sign")
        preview_code = need_otp_task.original_file.preview_code(need_otp_task.sign_stages.processing.first)
        @params[:sign_task_id] = need_otp_task.id
        @params[:code] = preview_code
        @params[:verify_info] = ''
        post @consent_path, params: @params

        put @path, params: @params.to_json, headers: @headers
        expect(response).to have_http_status(403)
        expect(json['error_code']).to eq(403_034)
        expect(json['error_key']).to eq('stage_need_verify')
        expect(json['verify_info'].present?).to be(true)
        expect(json['verify_info'].first['uuid'].present?).to be(true)
        expect(json['verify_info'].first['occassion']).to eq("sign")
        expect(json['verify_info'].first['verify_value'].present?).to be(false)
        expect(json['signer_email'].present?).to be(true)
      end
    end

    context '[normal sign]' do
      before(:each) do |example|
        @member = mock_member(:member_me, skip_auth: example.metadata[:skip_auth])
        mock_headers
      end

      it 'should return 200 and get sign task result if normal sign succeed', rpdoc_example_key: 200_3, rpdoc_example_name: '[normal sign] sign the task success' do
        task = FactoryBot.create(:waiting_for_me_with_fields)
        signature = FactoryBot.create(:signature, member: @member)
        image = FactoryBot.create(:image)
        @params[:sign_task_id] = task.id
        @params[:signature_info] = task.processing_stages[0].field_settings.map do |field_setting|
          value = case field_setting.field_type
            when 'signature'
              signature.id
            when 'image'
              image.id
            else
              mock_field_value(field_setting.field_type)
          end
          {
            object_id: field_setting.field_object_id,
            type: field_setting.field_type,
            value: value,
            changed: true
          }
        end
        put @path, params: @params.to_json, headers: @headers
        expect(response).to have_http_status(200)
        expect(json['data']['task_id']).to eq(task.id)
        expect(json['data']['after_sign_category']).to eq('waiting_for_others')

        task.reload
        expect(task.stages[1].sign_logs.count).to eq(1)
      end

      it 'should return 200 if normal sign with photo signature succeed', rpdoc_example_key: '200_with_photo_signature', rpdoc_example_name: '[normal sign] sign the task success with photo signature' do
        task = FactoryBot.create(:waiting_for_me_with_photo_signature)
        signature = FactoryBot.create(:signature, member: @member)
        signature_with_photo = FactoryBot.create(:signature, member: @member, category: 'signature_with_photo')
        @params[:sign_task_id] = task.id
        @params[:signature_info] = task.processing_stages[0].field_settings.map do |field_setting|
          value = case field_setting.field_type
            when 'signature'
              field_setting.options['photo'] ? signature_with_photo.id : signature.id
            else
              mock_field_value(field_setting.field_type)
          end
          {
            object_id: field_setting.field_object_id,
            type: field_setting.field_type,
            value: value,
            changed: true
          }
        end
        put @path, params: @params.to_json, headers: @headers
        expect(response).to have_http_status(200)
      end

      it 'should return 200 and get sign envelope result if normal sign succeed', rpdoc_example_key: 200_5, rpdoc_example_name: '[normal sign] sign the envelope success' do
        envelope = FactoryBot.create(:waiting_for_me_envelope)
        @params[:envelope_id] = envelope.id
        put @path, params: @params.to_json, headers: @headers
        expect(response).to have_http_status(200)
        expect(json['data']['envelope_id']).to eq(envelope.id)
        expect(json['data']['after_sign_category']).to eq('waiting_for_others')
      end

      it 'should fill the systemtime field when all stage signed', rpdoc_skip: true do
        allow_any_instance_of(SignStage).to receive(:stage_file).and_return({})
        mock_file_processing_service

        task = FactoryBot.create(:waiting_for_me2, :create_systemtime_field)
        @params[:sign_task_id] = task.id
        put @path, params: @params.to_json, headers: @headers
        expect(response).to have_http_status(200)
        task.reload
        task.field_settings.where(field_type: 'systemtime').each do |systemtime|
          expect(systemtime.field_value).not_to be_nil
        end
      end

      it 'should return 400038 if task is completed', rpdoc_example_key: 400038, rpdoc_example_name: '[normal sign] sign the task failed (task is completed)' do
        task = FactoryBot.create(:completed_task1)
        @params[:sign_task_id] = task.id
        put @path, params: @params.to_json, headers: @headers
        expect(response).to have_http_status(400)
        expect(json['error_code']).to eq(400038)
        expect(json['error_key']).to eq('task_not_signable')
      end

      it 'should return 400044 if task is not signer turn', rpdoc_example_key: 400044, rpdoc_example_name: '[normal sign] sign the task failed (not signer turn)' do
        task = FactoryBot.create(:waiting_for_others2)
        @params[:sign_task_id] = task.id
        put @path, params: @params.to_json, headers: @headers
        expect(response).to have_http_status(400)
        expect(json['error_code']).to eq(400044)
      end

      it 'should return 400048 if client not allowed', rpdoc_example_key: 400048, rpdoc_example_name: '[normal sign] sign the task failed (client not allowed)' do
        task = FactoryBot.create(:waiting_for_me1)
        @params[:client] = 'unknown client'
        @params[:sign_task_id] = task.id
        put @path, params: @params.to_json, headers: @headers
        expect(response).to have_http_status(400)
        expect(json['error_code']).to eq(400048)
      end

      it 'should return 403036 and get sign task result if normal sign failed', rpdoc_example_key: 403036_1, rpdoc_example_name: '[normal sign] sign the task failed (signed task not related)' do
        task = FactoryBot.create(:not_related2)
        @params[:sign_task_id] = task.id
        put @path, params: @params.to_json, headers: @headers
        expect(response).to have_http_status(403)
        expect(json['error_code']).to eq(403036)
        expect(json['error_key']).to eq('task_not_accessible')
      end

      it 'should return 400003 if invalid member', rpdoc_example_key: 400003, rpdoc_example_name: '[normal sign] sign the task failed (invalid member)', skip_auth: true do
        @headers['Authorization'] = 'Bearer invalid-token'
        task = FactoryBot.create(:waiting_for_me1)
        @params[:sign_task_id] = task.id
        put @path, params: @params.to_json, headers: @headers
        expect(response).to have_http_status(400)
        expect(json['error_code']).to eq(400003)
        expect(json['error_key']).to eq('invalid_member')
      end

      it 'should return 400_062 if sign without photo signature', rpdoc_example_key: '400_062_without_photo_signature', rpdoc_example_name: '[normal sign] sign the task failed (photo signature is not correct)' do
        task = FactoryBot.create(:waiting_for_me_with_photo_signature)
        signature = FactoryBot.create(:signature, member: @member)
        @params[:sign_task_id] = task.id
        @params[:signature_info] = task.processing_stages[0].field_settings.map do |field_setting|
          value = case field_setting.field_type
            when 'signature'
              signature.id
            else
              mock_field_value(field_setting.field_type)
          end
          {
            object_id: field_setting.field_object_id,
            type: field_setting.field_type,
            value: value,
            changed: true
          }
        end
        put @path, params: @params.to_json, headers: @headers
        expect(response).to have_http_status(400)
        expect(json['error_code']).to eq(400_062)
        expect(json['error_key']).to eq('field_content_invalid')
      end

      context '>> sign field settings group' do
        before(:each) do
          @task = FactoryBot.create(:waiting_for_me_with_field_groups)
          @stage = @task.processing_stages[0]
          @field_settings = @stage.field_settings
          @params[:sign_task_id] = @task.id
          checkbox_group = @stage.field_setting_groups.find_by(field_group_type: 'checkbox')
          radio_group = @stage.field_setting_groups.find_by(field_group_type: 'radio')
          2.times do |i|
            checkbox_field = checkbox_group.field_settings[i]
            @params[:signature_info] << {
              object_id: checkbox_field.field_object_id,
              type: 'checkbox',
              value: false
            }
            radio_field = radio_group.field_settings[i]
            @params[:signature_info] << {
              object_id: radio_field.field_object_id,
              type: 'radio',
              value: false
            }
          end
        end

        it 'should return 200 with checkbox / radio group', rpdoc_example_key: '200_with_field_group', rpdoc_example_name: '簽署任務成功 (with checkbox / radio group)' do |example|
          put @path, params: @params.to_json, headers: @headers
          expect(response).to have_http_status(200)
          expect(@stage.reload.status).to eq('processing_file')
          expect(@field_settings.reload.where(field_type: ['checkbox', 'radio']).pluck(:field_value).any?(nil)).to eq(false)
        end

        it 'should return 400_062 with checkbox / radio group', rpdoc_example_key: 400062, rpdoc_example_name: '簽署任務失敗 (with checkbox / radio group)' do |example|
          @stage.field_setting_groups[0].update(options: { force: true })
          put @path, params: @params.to_json, headers: @headers
          expect(response).to have_http_status(400)
          expect(json['error_code']).to eq(400_062)
          expect(json['error_key']).to eq('field_content_invalid')
        end

        it 'should return 400_062 if not match field_setting_group read_only rule', rpdoc_example_key: 400062_2, rpdoc_example_name: '簽署任務失敗 (with checkbox / radio group)' do |example|
          @stage.field_setting_groups[1].update(options: { read_only: true, force: false })
          @params[:signature_info].last[:value] = true
          put @path, params: @params.to_json, headers: @headers
          expect(response).to have_http_status(400)
          expect(json['error_code']).to eq(400_062)
          expect(json['error_key']).to eq('field_content_invalid')
        end
      end
    end

    context '[signer need cert]' do
      before(:each) do |example|
        mock_headers

        @signer_need_otp_task = FactoryBot.create(:signer_need_otp_task, verify_type: 'cht_personal')
        @params[:sign_task_id] = @signer_need_otp_task.id

        mock_setup_current_member(@signer_need_otp_task.stages.first.actor)
        allow(DigitalCertificate::Gra).to receive(:auth_ca).and_return({ 'result' => 1, 'tid' => 'gra_tid' })
      end

      it 'should return 400_085 if signer need to register CA', rpdoc_example_key: 403_085, rpdoc_example_name: '400_085 sign task failed (cht_personal) (request_ca_failed)' do
        allow(DigitalCertificate::Gra).to receive(:auth_ca).and_return({ 'result' => 11010, 'tid' => '' })
        allow(DigitalCertificate::Gra).to receive(:check_ca).and_return({ 'result' => 1})

        mock_hsm_secret_key
        put(@path, params: @params.to_json, headers: @headers)
        expect(response).to have_http_status(400)
      end

      it 'should return 403_034 if stage need cert (signer_need_otp_task)', rpdoc_example_key: 403_034, rpdoc_example_name: 'sign task failed (cht_personal) (stage need cert)' do
        put(@path, params: @params.to_json, headers: @headers)

        expect(response).to have_http_status(403)
        expect(json['error_code']).to eq(403_034)
        expect(json['error_key']).to eq('stage_need_verify')
        expect(json['verify_info'].present?).to eq(true)
        expect(json['verify_info'].first['uuid'].present?).to be(true)
        expect(json['verify_info'].first['occassion']).to eq("sign")
        expect(json['verify_info'].first['verify_value'].present?).to be(false)
        expect(json['signer_email'].present?).to be(true)
        expect(Rails.cache.read("ca_request:gra_tid").present?).to eq(true)
      end

      it 'should return 200 if stage passed cert auth already', rpdoc_example_key: 'cert_200', rpdoc_action_name: 'should return 200 if stage passed cert auth already' do
        put(@path, params: @params.to_json, headers: @headers)

        uuid = json['verify_info'][0]['uuid']
        auth_callback_params = {
          result: 1,
          resultMessage: "成功執行操作",
          email: "fredfan@cht.com.tw",
          expDate: "20991218180000",
          tid: "gra_tid"
        }
        post('/callbacks/gra/authorize', params: auth_callback_params.to_json, headers: @headers)
        @params[:verify_info] = { uuid: uuid }

        put(@path, params: @params.to_json, headers: @headers)
        expect(response).to have_http_status(200)
      end

      it 'should return 200 if stage passed cert auth already', rpdoc_example_key: 'cert_200_2', rpdoc_action_name: 'sign envelope succeed when stage passed cert auth already' do
        envelope = FactoryBot.create(:signer_need_otp_envelope)
        params = @params.except(:sign_task_id).merge({ envelope_id: envelope.id })
        put(@path, params: params.to_json, headers: @headers)

        uuid = json['verify_info'][0]['uuid']
        auth_callback_params = {
          result: 1,
          resultMessage: "成功執行操作",
          email: "fredfan@cht.com.tw",
          expDate: "20991218180000",
          tid: "gra_tid"
        }
        post('/callbacks/gra/authorize', params: auth_callback_params.to_json, headers: @headers)
        
        params[:verify_info] = { uuid: uuid }
        put(@path, params: params.to_json, headers: @headers)
        expect(response).to have_http_status(200)
      end
    end

    context '[normal sign with review]' do
      before(:each) do |example|
        mock_member(:member_me, skip_auth: example.metadata[:skip_auth])
        mock_headers
      end

      it 'should return 200 with reviewer', rpdoc_example_key: '200_with_reviewer', rpdoc_example_name: '[normal sign with review] sign the task success' do
        task = FactoryBot.create(:waiting_for_me4)
        @params[:sign_task_id] = task.id
        put @path, params: @params.to_json, headers: @headers
        expect(response).to have_http_status(200)
        expect(json['data']['after_sign_category']).to eq('waiting_for_others')

        task.reload
        expect(task.stages.first.status).to eq('signed')
        expect(task.stages.second.status).to eq('processing')
      end

      it 'should return 200 with self reviewer', rpdoc_example_key: '200_with_self_reviewer', rpdoc_example_name: '[normal sign with review] sign the task with self reviewer success' do
        task = FactoryBot.create(:waiting_for_me4)
        task.stages[1].update(email: task.stages[0].email, actor_id: task.stages[0].actor_id)
        @params[:sign_task_id] = task.id
        put @path, params: @params.to_json, headers: @headers
        expect(response).to have_http_status(200)
        expect(json['data']['after_sign_category']).to eq('waiting_for_me')
      end

      it 'should return 200 with no order reviewer', rpdoc_example_key: '200_with_no_order_reviewer', rpdoc_example_name: '[normal sign with review] sign the task with no order reviewer success' do
        task = FactoryBot.create(:waiting_for_me4, has_order: false)
        task.stages.update_all(sequence: task.stages.length)
        task.stages[3].processing!

        @params[:sign_task_id] = task.id
        put @path, params: @params.to_json, headers: @headers
        expect(response).to have_http_status(200)

        task.reload
        expect(task.stages.pluck(:sequence)).to eq([1, 3, 3, 4])
        expect(task.stages.pluck(:status)).to eq(['signed', 'processing', 'processing', 'processing'])
      end

      it 'should return 200 for modify', rpdoc_example_key: '200_modify', rpdoc_example_name: '[normal sign with review] modify the task success' do
        task = FactoryBot.create(:waiting_for_me_modify1)
        @params[:sign_task_id] = task.id
        put @path, params: @params.to_json, headers: @headers
        expect(response).to have_http_status(200)
        expect(json['data']['after_sign_category']).to eq('waiting_for_others')

        task.reload
        expect(task.stages.first.status).to eq('signed')
        expect(task.stages.second.status).to eq('processing')
      end
    end

    context '[quick sign with review]' do
      before(:each) do |example|
        mock_member(:not_register_member, skip_auth: true)
       
        @task = FactoryBot.create(:quick_sign_task2)
        @consent_path = '/api/v1/sign_tasks/consent'
        @params = @params.merge({
          check: true,
          code: @task.original_file.preview_code(@task.processing_stages[0], will_expired: true),
        })
        mock_headers(with_token: false)
        post @consent_path, params: @params
      end

      it 'should return 200 with reviewer', rpdoc_example_key: '200_quick_with_reviewer', rpdoc_example_name: '[quick sign with review] sign the task success' do
        put @path, params: @params.to_json, headers: @headers
        expect(response).to have_http_status(200)
        expect(json['data']['after_sign_category']).to eq('waiting_for_others')

        @task.reload
        expect(@task.stages.first.status).to eq('signed')
        expect(@task.stages.second.status).to eq('processing')
      end
    end

    context '[signer need cert with review]' do
      before(:each) do |example|
        mock_member(:member_me, skip_auth: example.metadata[:skip_auth])
        mock_headers
      end

      it 'should return 200 without verify', rpdoc_example_key: '200_need_cert_without_verify', rpdoc_example_name: '[signer need cert with review] sign the task success' do
        @task = FactoryBot.create(:signer_need_otp_task2, verify_type: 'cht_personal')
        @params[:sign_task_id] = @task.id
        put @path, params: @params.to_json, headers: @headers
        expect(response).to have_http_status(200)
      end

      it 'should return 403_034 if signer with review still need verify', rpdoc_example_key: '403_034_need_cert_with_verify', rpdoc_example_name: '[signer need cert with review] sign the task failed (signer with review still need verify)' do
        @task = FactoryBot.create(:signer_need_otp_task2, verify_type: 'email')
        @params[:sign_task_id] = @task.id
        put @path, params: @params.to_json, headers: @headers
        expect(response).to have_http_status(403)
        expect(json['error_code']).to eq(403_034)
        expect(json['error_key']).to eq('stage_need_verify')
      end
    end
  end
end
