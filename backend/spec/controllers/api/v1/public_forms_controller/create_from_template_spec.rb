# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Api::V1::PublicFormsController, type: :request do
  include_context 'rpdoc'

  before(:each) do |example|
    example.metadata[:rpdoc_action_key] = 'create_from_template'
    example.metadata[:rpdoc_action_name] = '透過範本建立公開表單'
    example.metadata[:rpdoc_example_folders] = ['v1', 'public_forms']

    @member = mock_member(:member_me, skip_auth: example.metadata[:skip_auth])
    @template = FactoryBot.create(:need_verify_template, owner: @member, dummy_stage_count: 2)

    mock_headers
    @path = '/api/v1/public_forms/create_from_template'
    @params = {
      template_id: @template.id,
      form_name: 'Test Form',
      description: 'This is test form',
      signer_infos: [
        {
          signer_type: 'form_signer',
          requisite: {
            name: 'required',
            email: 'optional'
          }
        },
        {
          signer_type: 'normal_signer',
          requisite: {
            name: 'required',
            email: 'required'
          }
        }
      ],
      cc_info: [
        { email: "cc@test.mail.com", name: "cc" },
        { email: "cc2@test.mail.com", name: "cc2" }
      ],
      message: 'This is a message',
      completed_message: 'This is a completed message',
      reference_setting: [
        {
          file_name: "Shortcut 2022-06-27 14.51.20.png",
          reference_type: "png",
          reference_id: "reference_file_e7fdfd20-2e7f-11ed-ae87-c7976acf797c"
        },
        {
          file_name: "DottedSign Test.pdf",
          reference_type: "pdf",
          reference_id: "reference_file_e9da1020-2e7f-11ed-ae87-c7976acf797c"
        }
      ],
      completed_reference_setting: [
        {
          file_name: "Shortcut 2022-06-27 14.51.20.png",
          reference_type: "png",
          reference_id: "reference_file_e7fdfd20-2e7f-11ed-ae87-c7976acf797c"
        }
      ]
    }
  end

  describe '#create_from_template' do
    it 'should return 200', rpdoc_example_key: 200, rpdoc_example_name: 'create public form success' do
      expect { post @path, params: @params.to_json, headers: @headers }
        .to change { @member.public_forms.count }.by(1)
      expect(response).to have_http_status(200)
      expect(json['data']['form_name']).to eq('Test Form')
      form_template = PublicForm.find(json['data']['id']).template
      expect(form_template.usage).to eq('public_form')
      expect(form_template.stages.first.verify_methods.count).to eq(@template.stages.first.verify_methods.count)
      expect(form_template.setting.cc_info.length).to eq(@params[:cc_info].length)
      expect(form_template.setting.message).to eq(@params[:message])
      expect(form_template.setting.completed_message).to eq(@params[:completed_message])
      expect(form_template.reference_upload_links.length).to eq(@params[:reference_setting].length)
      expect(form_template.completed_reference_upload_links.length).to eq(@params[:completed_reference_setting].length)
    end

    it 'should return 400_914 if invalid form info', rpdoc_example_key: 400_914, rpdoc_example_name: 'create public form failed (invalid form info)' do
      @params[:signer_infos].pop
      post @path, params: @params.to_json, headers: @headers
      expect(response).to have_http_status(400)
      expect(json['error_code']).to eq(400_914)
    end

    it 'should return 400_417 if params is invalid (requisite has no required)', rpdoc_example_key: 400_417, rpdoc_example_name: 'create public form failed (invalid_params, requisite has no required)' do |example|
      @params[:signer_infos][0][:requisite][:name] = 'optional'
      post(@path, params: @params.to_json, headers: @headers)
      expect(response).to have_http_status(400)
      expect(json['error_code']).to eq(400_417)
      expect(json['error_key']).to eq('invalid_params')
    end

    it 'should return 400_417 if params is invalid (invalid status)', rpdoc_example_key: 400_417_2, rpdoc_example_name: 'create public form failed (invalid_params, invalid status)' do
      @params[:status] = 'invalid_status'
      post @path, params: @params.to_json, headers: @headers
      expect(response).to have_http_status(400)
      expect(json['error_code']).to eq(400_417)
      expect(json['error_key']).to eq('invalid_params')
    end

    it 'should return 400_417 if params is invalid (invalid goal_num)', rpdoc_example_key: 400_417_3, rpdoc_example_name: 'create public form failed (invalid_params, invalid goal_num)' do
      @params[:goal_num] = 0
      post @path, params: @params.to_json, headers: @headers
      expect(response).to have_http_status(400)
      expect(json['error_code']).to eq(400_417)
      expect(json['error_key']).to eq('invalid_params')
    end

    it 'should return 400_417 if params is invalid (invalid end_at)', rpdoc_example_key: 400_417_4, rpdoc_example_name: 'create public form failed (invalid_params, invalid end_at)' do
      @params[:end_at] = 0
      post @path, params: @params.to_json, headers: @headers
      expect(response).to have_http_status(400)
      expect(json['error_code']).to eq(400_417)
      expect(json['error_key']).to eq('invalid_params')
    end

    it 'should return 400_417 if params include encryptable settings', rpdoc_example_key: 400_417_5, rpdoc_example_name: 'create public form failed (invalid_params, encryptable settings are not supported)' do
      @params[:is_encrypted] = true
      @params[:completion_password] = 'test_password'
      post @path, params: @params.to_json, headers: @headers
      expect(response).to have_http_status(400)
      expect(json['error_code']).to eq(400_417)
      expect(json['error_key']).to eq('invalid_params')
    end

    it 'should return 400_053 if template has deleted', rpdoc_example_key: 400_053, rpdoc_example_name: 'create public form failed (400_053 template has deleted)' do |example|
      @template.deleted!
      post(@path, params: @params.to_json, headers: @headers)
      expect(response).to have_http_status(400)
      expect(json['error_code']).to eq(400_053)
      expect(json['error_key']).to eq('template_deleted')
    end

    it 'should return 404_035 if template not found', rpdoc_example_key: 404_035, rpdoc_example_name: 'create public form failed (404_035 template not found)' do |example|
      @params[:template_id] = @params[:template_id] + 9999
      post(@path, params: @params.to_json, headers: @headers)
      expect(response).to have_http_status(404)
      expect(json['error_code']).to eq(404_035)
      expect(json['error_key']).to eq('template_not_found')
    end

    it 'should return 404_035 if template not found (because its xfdf is still building)', rpdoc_example_key: 404_035_1, rpdoc_example_name: 'create public form failed (404_035 template not found because its xfdf is still building)' do |example|
      @template.xfdf_documents.last.destroy
      @template.reload
      post(@path, params: @params.to_json, headers: @headers)
      expect(response).to have_http_status(404)
      expect(json['error_code']).to eq(404_035)
      expect(json['error_key']).to eq('template_not_found')
    end
  end
end
