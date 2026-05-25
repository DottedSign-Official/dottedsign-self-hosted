# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Api::V1::PublicForms::FormTasksController, type: :request do
  include_context 'rpdoc'

  before(:each) do |example|
    example.metadata[:rpdoc_action_key] = 'read'
    example.metadata[:rpdoc_action_name] = '讀取公開表單任務'
    example.metadata[:rpdoc_example_folders] = ['v1', 'public_forms', 'form_tasks']

    member = FactoryBot.create(:member_me)
    form = FactoryBot.create(:public_form, owner: member)
    @form_task = setup_form_task(form)

    mock_headers(http_method: :get, with_token: false)
    @path = '/api/v1/public_forms/form_tasks/read'
    @params = @client_info.merge(
      form_token: @form_task.form_token,
      signer_name: 'Test 2',
      signer_email: 'test2@test.com'
    )
  end

  describe '#read' do
    it 'should return 200', rpdoc_example_key: 200, rpdoc_example_name: 'read public form task success' do
      get(@path, params: @params, headers: @headers)
      expect(response).to have_http_status(200)
      @form_task.reload
      expect(json['data']['image_info']).to be_present
      expect(json['data']['stage_infos'][0]['full_info']['xfdf_text']).to be_present
      expect(json['data']['stage_infos'][0]['email']).to eq(@form_task.stages[0].actor_info['email']) # form-signer with designated email
    end

    it 'should return 400_913 if task not form', rpdoc_example_key: 400_913, rpdoc_example_name: 'read public form task failed (task not form)' do
      @form_task.create_and_invite!
      get(@path, params: @params, headers: @headers)
      expect(response).to have_http_status(400)
      expect(json['error_code']).to eq(400_913)
      expect(json['error_key']).to eq('task_not_form')
    end

    it 'should return 400_911 if not form signer stage', rpdoc_example_key: 400_911, rpdoc_example_name: 'read public form task failed (not form signer stage)' do
      @form_task.sign_stages[1].update(action: :sign)
      get(@path, params: @params, headers: @headers)
      expect(response).to have_http_status(400)
      expect(json['error_code']).to eq(400_911)
      expect(json['error_key']).to eq('stage_not_form')
    end

    it 'should return 400_901 if no proper signer_info', rpdoc_example_key: 400_901, rpdoc_example_name: 'read public form task failed (no proper signer info)' do
      @params.delete(:signer_name)
      get(@path, params: @params, headers: @headers)
      expect(response).to have_http_status(400)
      expect(json['error_code']).to eq(400_901)
      expect(json['error_key']).to eq('signer_info_not_ready')
    end
  end
end
