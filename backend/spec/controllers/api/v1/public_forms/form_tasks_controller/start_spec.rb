# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Api::V1::PublicForms::FormTasksController, type: :request do
  include_context 'rpdoc'

  before(:each) do |example|
    example.metadata[:rpdoc_action_key] = 'start'
    example.metadata[:rpdoc_action_name] = '開始公開表單任務'
    example.metadata[:rpdoc_example_folders] = ['v1', 'public_forms', 'form_tasks']

    @member = mock_member(:member_me, skip_auth: example.metadata[:skip_auth])
    @form = FactoryBot.create(:public_form, owner: @member)
    @member.tag(@form.template, with: ["test tag"], on: :tags)

    mock_headers
    @path = "/api/v1/public_forms/form_tasks/start"
    @params = {
      form_uuid: @form.uuid,
      signer_name: 'Form Signer 1',
      signer_email: 'form-signer1@test.com'
    }
  end

  describe '#start' do
    it 'should return 200', rpdoc_example_key: 200, rpdoc_example_name: 'start public form success' do
      post @path, params: @params.to_json, headers: @headers
      expect(response).to have_http_status(200)
      expect(json['data']['form_token']).to be_present

      task_tags = SignTask.find(json['data']['task_id']).tags.pluck(:name)
      template_tags = @form.template.tags.pluck(:name)
      expect(task_tags).to match_array(template_tags)
    end

    it 'should return 200 and no verify_methods for form signer when email is not required', rpdoc_skip: true do
      FactoryBot.create(:verify_method, stage: @form.template.stages.first)
      post @path, params: @params.to_json, headers: @headers
      expect(response).to have_http_status(200)
      expect(SignTask.find(json['data']['task_id']).stages.first.verify_methods).to be_empty
    end

    it 'should return 404_043 if form not found', rpdoc_example_key: 404_043, rpdoc_example_name: 'start public form failed (form not exist)' do
      @params[:form_uuid] = 'not_exist_uuid'
      post @path, params: @params.to_json, headers: @headers
      expect(response).to have_http_status(404)
      expect(json['error_code']).to eq(404_043)
      expect(json['error_key']).to eq('form_not_found')
    end

    it 'should return 400_915 if form is delete', rpdoc_example_key: 400_915, rpdoc_example_name: 'start public form failed (form deleted)' do
      @form.set_delete
      post @path, params: @params.to_json, headers: @headers
      expect(response).to have_http_status(400)
      expect(json['error_code']).to eq(400_915)
      expect(json['error_key']).to eq('form_is_deleted')
    end

    it 'should return 400_916 if form not publish', rpdoc_example_key: 400_916, rpdoc_example_name: 'start public form failed (form not publish)' do
      @form.unpublish!
      post @path, params: @params.to_json, headers: @headers
      expect(response).to have_http_status(400)
      expect(json['error_code']).to eq(400_916)
      expect(json['error_key']).to eq('form_not_publish')
    end

    it 'should return 400_901 if no proper signer_info', rpdoc_example_key: 400_901, rpdoc_example_name: 'start public form failed (no proper signer info)' do
      @params.delete(:signer_name)
      post @path, params: @params.to_json, headers: @headers
      expect(response).to have_http_status(400)
      expect(json['error_code']).to eq(400_901)
      expect(json['error_key']).to eq('signer_info_not_ready')
    end
  end
end
