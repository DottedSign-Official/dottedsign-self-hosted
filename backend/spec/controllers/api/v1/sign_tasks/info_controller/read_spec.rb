require 'rails_helper'

RSpec.describe Api::V1::SignTasks::InfoController, type: :request do
  include_context 'redis_cache'
  include_context 'rpdoc'

  before(:each) do |example|
    example.metadata[:rpdoc_action_key] = 'read'
    example.metadata[:rpdoc_action_name] = 'read task'
    example.metadata[:rpdoc_example_folders] = ['v1', 'sign_tasks', 'info']

    @headers = {
      'Content-Type' => 'application/json',
      'User-Agent' => 'RSpec',
      'Authorization' => 'Bearer {{rabbit_token}}',
    }
    @path = '/api/v1/sign_tasks/read'
    @params = {
      ip_address: '127.0.0.1',
      client: 'web',
      work_id: 'work_id'
    }
    mock_headers
  end

  describe '#read' do

    context '[normal read]' do
      before(:each) do |example|
        @member = mock_member(:member_me, skip_auth: example.metadata[:skip_auth])
        @task = FactoryBot.create(:waiting_for_me1)
        @params[:sign_task_id] = @task.id
      end

      it 'should return 200 if read task success', rpdoc_example_key: 200, rpdoc_example_name: '[normal read] read task success' do
        get(@path, params: @params, headers: @headers)
        expect(response).to have_http_status(200)
        expect(json['data']['file_name']).to eq(@task.file_name)
        expect(json['data']['has_order']).to eq(@task.has_order)
        expect(json['data']['status']).to eq('waiting')
        expect(json['data']['stage_infos'].count).to eq(@task.stages.length)
        expect(json['data']['task_owner_info']['name']).to eq('Me')
        expect(json['data']['task_owner_info']['status']).to eq('send')
        expect(json['data']['decline_reasons']).to be_a(Array)
        expect(json['data']['access_info']['view']).to eq('accessible')
        expect(json['data']['access_info']['review']).not_to eq('accessible')
        expect(json['data']).to have_key('viewable_attachments')
        expect(json['data']).to have_key('image_info')

        stage = @task.stages[0]
        expect(json['data']['stage_infos'][0]['email']).to eq(stage.email)
        expect(json['data']['stage_infos'][0]['action_type']).to eq(stage.status)
        expect(json['data']['decline_reasons']).to be_a(Array)
      end

      it 'should return 200 if read task with field_setting_groups success', rpdoc_example_key: 200_2, rpdoc_example_name: '[normal read] read task with field_setting_groups success' do |example|
        task = FactoryBot.create(:waiting_for_me_with_field_groups)
        stage = task.stages[1]
        params = @params.merge(sign_task_id: task.id)
        checkbox_group = stage.field_setting_groups.find_by(field_group_type: 'checkbox')
        radio_group = stage.field_setting_groups.find_by(field_group_type: 'radio')

        get(@path, params: params, headers: @headers)
        expect(json['data']['stage_infos'][1]['full_info']['field_setting_groups'].present?).to eq(true)
        expect(json['data']['stage_infos'][1]['full_info']['field_setting_groups'].size).to eq(2)
        field_settings_size = stage.reload.field_settings.size
        expect(json['data']['stage_infos'][1]['full_info']['field_settings'][field_settings_size-1]['field_group_object_id']).to eq(radio_group.field_group_object_id)
        expect(json['data']['stage_infos'][1]['full_info']['field_settings'][field_settings_size-2]['field_group_object_id']).to eq(checkbox_group.field_group_object_id)
        expect(json['data']['stage_infos'][1]['full_info']['field_settings'][field_settings_size-3]['field_group_object_id']).to eq(radio_group.field_group_object_id)
        expect(json['data']['stage_infos'][1]['full_info']['field_settings'][field_settings_size-4]['field_group_object_id']).to eq(checkbox_group.field_group_object_id)
      end

      it 'should return 200 if read task with photo signature success', rpdoc_example_key: 200_3, rpdoc_example_name: '[normal read] read task with photo signature success' do |example|
        task = FactoryBot.create(:waiting_for_me_with_photo_signature)
        params = @params.merge(sign_task_id: task.id)
        get(@path, params: params, headers: @headers)
        expect(response).to have_http_status(200)

        signature_field_setting = json['data']['stage_infos'][0]['full_info']['field_settings'].find { |field_setting| field_setting['options']['photo'] == true }
        expect(signature_field_setting['photo_link'].present?).to eq(true)
      end

      it 'should return 403_034 if member need to be verified before read task', rpdoc_example_key: 403034_4, rpdoc_example_name: '[normal read] (403_034 stage need verify)' do
        task = FactoryBot.create(:owner_need_read_otp_task)
        @params[:sign_task_id] = task.id

        get(@path, params: @params, headers: @headers)
        expect(response).to have_http_status(403)
        expect(json['error_code']).to eq(403034)
        expect(json['error_key']).to eq('stage_need_verify')
        expect(json['verify_info'].present?).to be(true)
        expect(json['verify_info'].first['uuid'].present?).to be(true)
        expect(json['verify_info'].first['occassion']).to eq("read")
        expect(json['verify_info'].first['verify_value'].present?).to be(false)
        expect(json['signer_email'].present?).to be(true)
      end

      it 'should return 200 if member pass verified before read task', rpdoc_example_key: 200_1, rpdoc_example_name: '[normal read] verify success' do
        task = FactoryBot.create(:owner_need_read_otp_task)
        verify_method = task.processing_stages.first.verify_methods.normal.read.first
        @params[:sign_task_id] = task.id
        @params[:verify_info] = {
          uuid: verify_method.uuid,
          verify_data: '000000'
        }

        get(@path, params: @params, headers: @headers)
        expect(response).to have_http_status(200)
        expect(json['data']['verify_info']['identity_verify_token'].present?).to be(true)
      end

      it 'should return 403036 if task not accessible', rpdoc_example_key: 403036, rpdoc_example_name: '[normal read] 403_036(task_not_accessible) read task failed' do
        task = FactoryBot.create(:not_related)
        @params[:sign_task_id] = task.id

        get(@path, params: @params, headers: @headers)
        expect(response).to have_http_status(403)
        expect(json['error_code']).to eq(403036)
      end

      it 'should return 400003 if invalid member', rpdoc_example_key: 400003, rpdoc_example_name: '[normal read] read task failed (invalid member)', skip_auth: true do
        @headers['Authorization'] = 'Bearer invalid-token'

        get(@path, params: @params, headers: @headers)
        expect(response).to have_http_status(400)
        expect(json['error_code']).to eq(400003)
        expect(json['error_key']).to eq('invalid_member')
      end

      context '>> in group' do
        before(:each) do
          FactoryBot.create(:group_member)
          mock_group(@member)
          @member_a = FactoryBot.create(:member_a)
          mock_group(@member_a)
        end

        context '>>> group sender' do
          before(:each) do
            @task = FactoryBot.create(:a_sender_complete_task)
            @params[:sign_task_id] = @task.id
          end

          include_examples 'group_allow_examples', 'get', 'view_team_tasks', 'group_sender', 200_2
          include_examples 'group_task_forbid_examples', 'get', 'view_team_tasks', 'group_sender', 403036_1
        end

        context '>>> group signer' do
          before(:each) do
            @task = FactoryBot.create(:a_signer_complete_task)
            @params[:sign_task_id] = @task.id
          end

          include_examples 'group_allow_examples', 'get', 'view_team_tasks', 'group_signer', 200_3
          include_examples 'group_task_forbid_examples', 'get', 'view_team_tasks', 'group_signer', 403036_2
        end
      end
    end

    context '[envelope normal read]' do
      before(:each) do |example|
        @member = mock_member(:member_me, skip_auth: example.metadata[:skip_auth])
        @envelope = FactoryBot.create(:waiting_for_me_envelope)
        @params[:envelope_id] = @envelope.id
      end

      it 'should return 200 if read envelope success', rpdoc_example_key: 200_6, rpdoc_example_name: '[envelope normal read] read envelope success' do
        get(@path, params: @params, headers: @headers)
        expect(response).to have_http_status(200)
        expect(json['data']['envelope_name']).to eq(@envelope.envelope_name)
        expect(json['data']['has_order']).to eq(@envelope.has_order)
        expect(json['data']['status']).to eq('waiting')
        expect(json['data']['stage_infos'].count).to eq(@envelope.stages.length)
        expect(json['data']['envelope_owner_info']['name']).to eq('Me')
        expect(json['data']['envelope_owner_info']['status']).to eq('send')
        expect(json['data']['decline_reasons']).to be_a(Array)
        expect(json['data']).to have_key('viewable_attachments')
        expect(json['data']).to have_key('image_info')

        stage = @envelope.stages[0]
        expect(json['data']['stage_infos'][0]['email']).to eq(stage.email)
        expect(json['data']['stage_infos'][0]['action_type']).to eq(stage.status)
        expect(json['data']['decline_reasons']).to be_a(Array)
      end

      it 'should return 403034 if member need to be verified before read envelope', rpdoc_example_key: 403034_2, rpdoc_example_name: '[envelope normal read] stage need verify' do
        envelope = FactoryBot.create(:owner_need_read_otp_envelope)
        @params[:envelope_id] = envelope.id

        get(@path, params: @params, headers: @headers)
        expect(response).to have_http_status(403)
        expect(json['error_code']).to eq(403034)
        expect(json['error_key']).to eq('stage_need_verify')
        expect(json['verify_info'].present?).to be(true)
        expect(json['verify_info'].first['uuid'].present?).to be(true)
        expect(json['verify_info'].first['occassion']).to eq("read")
        expect(json['verify_info'].first['verify_value'].present?).to be(false)
        expect(json['signer_email'].present?).to be(true)
      end

      it 'should return 200 if member pass verified before read envelope', rpdoc_example_key: 200_7, rpdoc_example_name: '[envelope normal read] verify success' do
        envelope = FactoryBot.create(:owner_need_read_otp_envelope)
        verify_method = envelope.sign_stages.processing.first.verify_methods.normal.read.first
        @params[:envelope_id] = envelope.id
        @params[:verify_info] = {
          uuid: verify_method.uuid,
          verify_data: '000000'
        }

        get(@path, params: @params, headers: @headers)
        expect(response).to have_http_status(200)
        expect(json['data']['verify_info']['identity_verify_token'].present?).to be(true)
      end

      it 'should return 403067 if envelope not accessible', rpdoc_example_key: 403067, rpdoc_example_name: '[envelope normal read] read envelope failed (envelope_not_accessible)' do
        envelope = FactoryBot.create(:not_related_envelope)
        @params[:envelope_id] = envelope.id

        get(@path, params: @params, headers: @headers)
        expect(response).to have_http_status(403)
        expect(json['error_code']).to eq(403067)
      end

      it 'should return 400003 if invalid member', rpdoc_example_key: 400003, rpdoc_example_name: '[envelope normal read] read envelope failed (invalid member)', skip_auth: true do
        @headers['Authorization'] = 'Bearer invalid-token'

        get(@path, params: @params, headers: @headers)
        expect(response).to have_http_status(400)
        expect(json['error_code']).to eq(400003)
        expect(json['error_key']).to eq('invalid_member')
      end

      context '>> in group' do
        before(:each) do
          FactoryBot.create(:group_member)
          mock_group(@member)
          @member_a = FactoryBot.create(:member_a)
          mock_group(@member_a)
        end

        context '>>> group sender' do
          before(:each) do
            @envelope = FactoryBot.create(:a_sender_completed_envelope)
            @params[:envelope_id] = @envelope.id
          end

          include_examples 'group_allow_examples', 'get', 'view_team_tasks', 'group_sender', 200_8
          include_examples 'group_envelope_forbid_examples', 'get', 'view_team_tasks', 'group_sender', 403067_2
        end

        context '>>> group signer' do
          before(:each) do
            @envelope = FactoryBot.create(:a_signer_completed_envelope)
            @params[:envelope_id] = @envelope.id
          end

          include_examples 'group_allow_examples', 'get', 'view_team_tasks', 'group_signer', 200_9
          include_examples 'group_envelope_forbid_examples', 'get', 'view_team_tasks', 'group_signer', 403067_3
        end
      end
    end

    context '[quick read]' do
      before(:each) do
        @member = mock_member(:not_register_member, skip_auth: true)
        @quick_sign_task = FactoryBot.create(:quick_sign_task)
        @params[:code] = mock_preview_code_accepted(@quick_sign_task, @quick_sign_task.sign_stages.processing.first)
        @headers = { 'Content-Type' => 'application/json' }
      end

      it 'should return 200 if quick read success', rpdoc_example_key: 200_4, rpdoc_example_name: '[quick read] read task success' do
        get(@path, params: @params, headers: @headers)
        expect(response).to have_http_status(200)
      end

      it 'should return 403_034 if guest need to be verified before read task', rpdoc_example_key: 403034_3, rpdoc_example_name: '[quick read] (403_034 stage need verify)' do
        @member = mock_member(:not_register_member_need_otp, skip_auth: true)
        need_otp_task = FactoryBot.create(:quick_signer_need_otp_task)
        @params[:code] = mock_preview_code_accepted(need_otp_task, need_otp_task.sign_stages.processing.first)

        get(@path, params: @params, headers: @headers)
        expect(response).to have_http_status(403)
        expect(json['error_code']).to eq(403034)
        expect(json['error_key']).to eq('stage_need_verify')
        expect(json['verify_info'].first['uuid'].present?).to be(true)
        expect(json['verify_info'].first['occassion']).to eq("read")
        expect(json['verify_info'].first['verify_value'].present?).to be(false)
        expect(json['signer_email'].present?).to be(true)
      end

      it 'should return 200 if guest pass verified before read task', rpdoc_example_key: 200_5, rpdoc_example_name: '[quick read] 200 read task before verify success' do
        @member = mock_member(:not_register_member_need_otp, skip_auth: true)
        need_otp_task = FactoryBot.create(:quick_signer_need_otp_task)
        @params[:code] = mock_preview_code_accepted(need_otp_task, need_otp_task.sign_stages.processing.first)
        verify_method = need_otp_task.processing_stages.first.verify_methods.normal.read.first
        @params[:verify_info] = {
          uuid: verify_method.uuid,
          verify_data: '000000'
        }

        get(@path, params: @params, headers: @headers)
        expect(response).to have_http_status(200)
        expect(json['data']['verify_info']['identity_verify_token'].present?).to be(true)
        expect(json['data']['stage_infos'].first['full_info']['verify_methods'].present?).to be(true)
      end

      it 'should return 400_045 if code not match', rpdoc_example_key: 400_045, rpdoc_example_name: '[quick read] 400_045(code not match)' do
        @params[:sign_task_id] = '10000'

        get(@path, params: @params, headers: @headers)
        expect(response).to have_http_status(400)
        expect(json['error_code']).to eq(400_045)
        expect(json['error_key']).to eq('code_not_match')
      end

      it 'should return 403_037 if need to consent', rpdoc_example_key: 403_037, rpdoc_example_name: '[quick read] 403_037(quick_sign_not_accepted)' do
        Rails.cache.delete(@cache_key)

        get(@path, params: @params, headers: @headers)
        expect(response).to have_http_status(403)
        expect(json['error_code']).to eq(403_037)
        expect(json['error_key']).to eq('quick_sign_not_accepted')
      end

      it 'should return 406_031 if member verify failed', rpdoc_example_key: 406_031, rpdoc_example_name: '[quick read] 406_031(verify_failed) Read task failed' do
        @member = mock_member(:not_register_member_need_otp, skip_auth: true)
        need_otp_task = FactoryBot.create(:quick_signer_need_otp_task)
        @params[:code] = mock_preview_code_accepted(need_otp_task, need_otp_task.sign_stages.processing.first)
        verify_method = need_otp_task.processing_stages.first.verify_methods.normal.read.first
        @params[:verify_info] = {
          uuid: verify_method.uuid,
          verify_data: '111111'
        }

        get(@path, params: @params, headers: @headers)
        expect(response).to have_http_status(406)
        expect(json['error_code']).to eq(406_031)
        expect(json['error_key']).to eq('verify_failed')
      end
    end

    context '[envelope quick read]' do
      before(:each) do
        @member = mock_member(:not_register_member, skip_auth: true)
        @quick_sign_envelope = FactoryBot.create(:quick_sign_envelope)
        @params[:code] = mock_preview_code_accepted(@quick_sign_envelope, @quick_sign_envelope.processing_stages.first)
        @headers = { 'Content-Type' => 'application/json' }
      end

      it 'should return 200 if quick read success', rpdoc_example_key: 200_10, rpdoc_example_name: '[envelope quick read] read envelope success' do
        get(@path, params: @params, headers: @headers)
        expect(response).to have_http_status(200)
      end

      it 'should return 403_034 if guest need to be verified before read envelope', rpdoc_example_key: 403034_5, rpdoc_example_name: '[envelope quick read] read envelope failed (stage need verify)' do
        @member = mock_member(:not_register_member_need_otp, skip_auth: true)
        need_otp_envelope = FactoryBot.create(:quick_signer_need_otp_envelope)
        params = @params.merge(code: mock_preview_code_accepted(need_otp_envelope, need_otp_envelope.processing_stages.first))

        get(@path, params: params, headers: @headers)
        expect(response).to have_http_status(403)
        expect(json['error_code']).to eq(403034)
        expect(json['error_key']).to eq('stage_need_verify')
        expect(json['verify_info'].first['uuid'].present?).to be(true)
        expect(json['verify_info'].first['occassion']).to eq("read")
        expect(json['verify_info'].first['verify_value'].present?).to be(false)
        expect(json['signer_email'].present?).to be(true)
      end

      it 'should return 200 if guest pass verified before read envelope', rpdoc_example_key: 200_11, rpdoc_example_name: '[envelope quick read] read task before verify success' do
        @member = mock_member(:not_register_member_need_otp, skip_auth: true)
        need_otp_envelope = FactoryBot.create(:quick_signer_need_otp_envelope)
        verify_method = need_otp_envelope.processing_stages.first.verify_methods.normal.read.first
        params = @params.merge(code: mock_preview_code_accepted(need_otp_envelope, need_otp_envelope.processing_stages.first))
        params[:verify_info] = {
          uuid: verify_method.uuid,
          verify_data: '000000'
        }

        get(@path, params: params, headers: @headers)
        expect(response).to have_http_status(200)
        expect(json['data']['verify_info']['identity_verify_token'].present?).to be(true)
        expect(json['data']['stage_infos'].first['full_info']['verify_methods'].present?).to be(true)
      end

      it 'should return 400045 if code not match', rpdoc_example_key: 400045, rpdoc_example_name: '[envelope quick read] read envelope failed (code not match)' do
        @params[:envelope_id] = '10000'

        get(@path, params: @params, headers: @headers)
        expect(response).to have_http_status(400)
        expect(json['error_code']).to eq(400045)
        expect(json['error_key']).to eq('code_not_match')
      end

      it 'should return 403037 if need to consent', rpdoc_example_key: 403037, rpdoc_example_name: '[envelope quick read] read envelope failed (quick_sign_not_accepted)' do
        Rails.cache.delete(@cache_key)

        get(@path, params: @params, headers: @headers)
        expect(response).to have_http_status(403)
        expect(json['error_code']).to eq(403037)
        expect(json['error_key']).to eq('quick_sign_not_accepted')
      end

      it 'should return 406031 if member verify failed', rpdoc_example_key: 406031, rpdoc_example_name: '[envelope quick read] read envelope failed (verify_failed)' do
        @member = mock_member(:not_register_member_need_otp, skip_auth: true)
        need_otp_envelope = FactoryBot.create(:quick_signer_need_otp_envelope)
        @params[:code] = mock_preview_code_accepted(need_otp_envelope, need_otp_envelope.processing_stages.first)
        verify_method = need_otp_envelope.processing_stages.first.verify_methods.normal.read.first
        @params[:verify_info] = {
          uuid: verify_method.uuid,
          verify_data: '111111'
        }

        get(@path, params: @params, headers: @headers)
        expect(response).to have_http_status(406)
        expect(json['error_code']).to eq(406031)
        expect(json['error_key']).to eq('verify_failed')
      end
    end

    context '[normal review read]' do
      before(:each) do |example|
        @member = mock_member(:member_me, skip_auth: example.metadata[:skip_auth])
        @task = FactoryBot.create(:waiting_for_me_review1)
        @params[:sign_task_id] = @task.id
      end

      it 'should return 200 if reviewer read task success', rpdoc_example_key: '200_review_read', rpdoc_example_name: 'reviewer read task success' do
        get(@path, params: @params, headers: @headers)
        expect(response).to have_http_status(200)

        stage = @task.reload.stages[0]
        expect(json['data']['review_info']['signed_stage_id']).to eq(stage.id)
        expect(json['data']['review_info']['signed_fields'].pluck('field_object_id')).to eq(stage.pdf_object_info)
        expect(json['data']['review_info']['signed_attachments'].pluck('attachment_id')).to eq(stage.attachment_setting.pluck('attachment_id'))
        expect(json['data']['review_info']['reviewed_fields'].present?).to be(false)
        expect(json['data']['review_info']['reviewed_attachments'].present?).to be(false)
        expect(json['data']['access_info']['review']).to eq('accessible')
        expect(json['data']['current_member_turn']).to eq(true)
        expect(json['data']['current_available_actions']).to eq(['view', 'review'])
      end

      it 'should return 200 if reviewer read task again success', rpdoc_example_key: '200_review_read_again', rpdoc_example_name: 'reviewer read task again success' do
        @task = FactoryBot.create(:waiting_for_me_review2)
        @params[:sign_task_id] = @task.id

        get(@path, params: @params, headers: @headers)
        expect(response).to have_http_status(200)

        stage = @task.reload.stages[0]
        expect(json['data']['review_info']['signed_stage_id']).to eq(stage.id)
        expect(json['data']['review_info']['signed_fields'].pluck('field_object_id')).to eq(stage.pdf_object_info)
        expect(json['data']['review_info']['signed_attachments'].pluck('attachment_id')).to eq(stage.attachment_setting.pluck('attachment_id'))
        expect(json['data']['review_info']['reviewed_fields'].pluck('field_object_id')).to eq(stage.pdf_object_info)
        expect(json['data']['review_info']['reviewed_attachments'].pluck('attachment_id')).to eq(stage.attachment_setting.pluck('attachment_id'))
      end
    end

    context '[normal modify read]' do
      before(:each) do |example|
        @member = mock_member(:member_me, skip_auth: example.metadata[:skip_auth])
        @task = FactoryBot.create(:waiting_for_me_modify1)
        @params[:sign_task_id] = @task.id
      end

      it 'should return 200 if signer read task for modify success', rpdoc_example_key: '200_modify_read', rpdoc_example_name: 'signer read task for modify success' do
        get(@path, params: @params, headers: @headers)
        expect(response).to have_http_status(200)

        stage = @task.reload.stages[0]
        expect(json['data']['review_info']['signed_stage_id'].present?).to be(false)
        expect(json['data']['review_info']['signed_fields'].present?).to be(false)
        expect(json['data']['review_info']['signed_attachments'].present?).to be(false)
        expect(json['data']['review_info']['reviewed_fields'].pluck('field_object_id')).to eq(stage.pdf_object_info)
        expect(json['data']['review_info']['reviewed_attachments'].pluck('attachment_id')).to eq(stage.attachment_setting.pluck('attachment_id'))
        expect(json['data']['current_member_turn']).to eq(true)
        expect(json['data']['current_available_actions']).to eq(['view', 'sign'])
      end
    end

    context '[normal confirm read]' do
      before(:each) do |example|
        @member = mock_member(:member_me, skip_auth: example.metadata[:skip_auth])
        @task = FactoryBot.create(:waiting_for_me_confirm1)
        @params[:sign_task_id] = @task.id
      end

      it 'should return 200 if signer read task for confirm success', rpdoc_example_key: '200_confirm_read', rpdoc_example_name: 'signer read task for confirm success' do
        get(@path, params: @params, headers: @headers)
        expect(response).to have_http_status(200)

        stage = @task.reload.stages[0]
        expect(json['data']['review_info']['signed_stage_id'].present?).to be(false)
        expect(json['data']['review_info']['signed_fields'].present?).to be(false)
        expect(json['data']['review_info']['signed_attachments'].present?).to be(false)
        expect(json['data']['review_info']['reviewed_fields'].present?).to be(false)
        expect(json['data']['review_info']['reviewed_attachments'].present?).to be(false)
        expect(json['data']['access_info']['confirm']).to eq('accessible')
        expect(json['data']['current_member_turn']).to eq(true)
        expect(json['data']['current_available_actions']).to eq(['view', 'confirm'])
      end
    end

    context '[quick review read]' do
      before(:each) do |example|
        @member = mock_member(:member_me, skip_auth: true)
        @task = FactoryBot.create(:quick_sign_waiting_for_review_task)
        @params[:code] = mock_preview_code_accepted(@task, @task.sign_stages.acting.first)
        @headers = { 'Content-Type' => 'application/json' }
      end

      it 'should return 200 if quick reviewer read task success', rpdoc_example_key: '200_quick_review_read', rpdoc_example_name: 'signer read task for quick review success' do
        get(@path, params: @params, headers: @headers)
        expect(response).to have_http_status(200)
      end
    end

    context '[quick modify read]' do
      before(:each) do |example|
        @member = mock_member(:member_me, skip_auth: true)
        @task = FactoryBot.create(:quick_sign_waiting_for_modify_task)
        @params[:code] = mock_preview_code_accepted(@task, @task.sign_stages.acting.first)
        @headers = { 'Content-Type' => 'application/json' }
      end

      it 'should return 200 if quick signer read task for modify success', rpdoc_example_key: '200_quick_modify_read', rpdoc_example_name: 'quick signer read task for modify success' do
        get(@path, params: @params, headers: @headers)
        expect(response).to have_http_status(200)
      end
    end

    context '[quick confirm read]' do
      before(:each) do |example|
        @member = mock_member(:member_me, skip_auth: true)
        @task = FactoryBot.create(:quick_sign_waiting_for_confirm_task)
        @params[:code] = mock_preview_code_accepted(@task, @task.sign_stages.acting.first)
        @headers = { 'Content-Type' => 'application/json' }
      end

      it 'should return 200 if quick signer read task for confirm success', rpdoc_example_key: '200_quick_confirm_read', rpdoc_example_name: 'quick signer read task for confirm success' do
        get(@path, params: @params, headers: @headers)
        expect(response).to have_http_status(200)
      end
    end
  end
end
