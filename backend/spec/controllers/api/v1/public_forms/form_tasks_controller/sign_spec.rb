# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Api::V1::PublicForms::FormTasksController, type: :request do
  include_context 'rpdoc'

  before(:each) do |example|
    example.metadata[:rpdoc_action_key] = 'sign'
    example.metadata[:rpdoc_action_name] = '簽署公開表單任務'
    example.metadata[:rpdoc_example_folders] = ['v1', 'public_forms', 'form_tasks']

    @member = mock_member(:member_me, skip_auth: true)
    @form = FactoryBot.create(:public_form, owner: @member)
    @form_task = mock_form_task_read(@form)
    @stage = @form_task.sign_stages.processing.first
    field_setting = @stage.field_settings.find { |field_setting| field_setting.field_type == 'signature' }
    @guest_sign = FactoryBot.create(:guest_signature)
    
    mock_headers
    @path = "/api/v1/public_forms/form_tasks/sign"
    @params = @client_info.merge(
      form_token: @form_task.form_token,
      signature_info: [{
        object_id: field_setting.field_object_id,
        type: 'guest_signature',
        value: @guest_sign.id
      }]
    )
  end

  describe '#sign' do
    it 'should return 200', rpdoc_example_key: 200, rpdoc_example_name: 'sign public form task success' do
      put @path, params: @params.to_json, headers: @headers
      expect(response).to have_http_status(200)
      expect(json['data']['stage_infos'][1]['email']).to eq(@stage.actor_info['email'])
    end

    it 'should change form sent num', rpdoc_skip: true do
      expect(@form.sent_num).to eq(0)
      put @path, params: @params.to_json, headers: @headers
      @form.reload
      expect(@form.sent_num).to eq(1)
    end

    it 'should return 400_913 if task not form', rpdoc_example_key: 400_913, rpdoc_example_name: 'sign public form task failed (task not form)' do
      @form_task.create_and_invite!
      put @path, params: @params.to_json, headers: @headers
      expect(response).to have_http_status(400)
      expect(json['error_code']).to eq(400_913)
      expect(json['error_key']).to eq('task_not_form')
    end

    it 'should return 400_911 if not form signer stage', rpdoc_example_key: 400_911, rpdoc_example_name: 'sign public form task failed (not form signer stage)' do
      @form_task.sign_stages[1].update(action: :sign)
      put @path, params: @params.to_json, headers: @headers
      expect(response).to have_http_status(400)
      expect(json['error_code']).to eq(400_911)
      expect(json['error_key']).to eq('stage_not_form')
    end

    it 'should return 400_901 if no proper signer_info', rpdoc_example_key: 400_901, rpdoc_example_name: 'sign public form task failed (no proper signer info)' do
      stage = @form_task.sign_stages.processing.first
      stage.actor_info.delete('name')
      stage.actor_info.delete('email')
      stage.save
      put @path, params: @params.to_json, headers: @headers
      expect(response).to have_http_status(400)
      expect(json['error_code']).to eq(400_901)
      expect(json['error_key']).to eq('signer_info_not_ready')
    end
  end
end
