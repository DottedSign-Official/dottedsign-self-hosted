require 'rails_helper'

RSpec.describe Api::V1::TemplatesController, type: :request do
  include_context 'rpdoc'

  before(:each) do |example|
    example.metadata[:rpdoc_action_key] = 'duplicate'
    example.metadata[:rpdoc_action_name] = 'duplicate template'
    example.metadata[:rpdoc_example_folders] = ['v1', 'templates']

    mock_upload
    @member = mock_member(:member_me, skip_auth: example.metadata[:skip_auth])
    @template = FactoryBot.create(:need_verify_template, owner: @member, dummy_stage_count: 2)

    @headers = {
      'Content-Type' => 'application/json',
      'Authorization' => 'Bearer {{rabbit_token}}'
    }
    @path = '/api/v1/templates/duplicate'
    @params = {
      template_id: @template.id,
      template_name: 'Duplicated Template Name'
    }
  end

  describe '#duplicate' do
    it 'should return 200 and duplicate template success', rpdoc_example_key: 200, rpdoc_example_name: 'duplicate template success' do
      expect {
        post @path, params: @params.to_json, headers: @headers
      }.to change(Template, :count).by(1)

      expect(response).to have_http_status(200)
      expect(json['data']['template_name']).to eq(@params[:template_name])
      expect(json['data']['template_id']).to be_present
      expect(json['data']['created_at']).to be_present

      new_template = Template.find(json['data']['template_id'])
      expect(new_template.file_name).to eq(@params[:template_name])
      expect(new_template.owner_id).to eq(@member.id)
      expect(new_template.has_order).to eq(@template.has_order)
      expect(new_template.status).to eq('active')
      expect(new_template.code).to eq(@template.code)
      expect(new_template.dummy_stages.count).to eq(@template.dummy_stages.count)
      expect(new_template.dummy_stages.first.actor_info).to eq(@template.dummy_stages.first.actor_info)
      expect(new_template.dummy_stages.first.sequence).to eq(@template.dummy_stages.first.sequence)
      expect(new_template.dummy_stages.last.verify_methods.count).to eq(@template.dummy_stages.last.verify_methods.count)
    end

    it 'should duplicate field settings from original template', rpdoc_example_key: 200_2, rpdoc_example_name: 'duplicate template with field settings success' do
      post @path, params: @params.to_json, headers: @headers

      expect(response).to have_http_status(200)
      new_template = Template.find(json['data']['template_id'])
      expect(new_template.field_settings.count).to eq(@template.field_settings.count)
      expect(new_template.field_setting_groups.count).to eq(@template.field_setting_groups.count)
    end

    it 'should use default template name if template_name is missing', rpdoc_example_key: 200_3, rpdoc_example_name: 'duplicate template success with default name' do
      @params.delete(:template_name)
      post @path, params: @params.to_json, headers: @headers

      expect(response).to have_http_status(200)
      expect(json['data']['template_name']).to eq("#{@template.file_name}")
    end

    it 'should return 404035 if template_id is missing', rpdoc_example_key: 404035_1, rpdoc_example_name: 'duplicate template failed (missing template_id)' do
      @params.delete(:template_id)
      post @path, params: @params.to_json, headers: @headers

      expect(response).to have_http_status(404)
      expect(json['error_code']).to eq(404035)
      expect(json['error_key']).to eq('template_not_found')
    end

    it 'should return 404035 if template not found', rpdoc_example_key: 404035, rpdoc_example_name: 'duplicate template failed (template not found)' do
      @params[:template_id] = 999999
      post @path, params: @params.to_json, headers: @headers

      expect(response).to have_http_status(404)
      expect(json['error_code']).to eq(404035)
      expect(json['error_key']).to eq('template_not_found')
    end

    it 'should return 400053 if template is deleted', rpdoc_example_key: 400053, rpdoc_example_name: 'duplicate template failed (template deleted)' do
      @template.deleted!
      post @path, params: @params.to_json, headers: @headers

      expect(response).to have_http_status(400)
      expect(json['error_code']).to eq(400053)
      expect(json['error_key']).to eq('template_deleted')
    end

    it 'should return 403044 if template not accessible (not owner)', rpdoc_example_key: 403044, rpdoc_example_name: 'duplicate template failed (not owner)' do
      other_member = FactoryBot.create(:member_a)
      @template.update!(owner: other_member)
      post @path, params: @params.to_json, headers: @headers

      expect(response).to have_http_status(403)
      expect(json['error_code']).to eq(403044)
      expect(json['error_key']).to eq('template_not_accessible')
    end

    it 'should return 400003 if invalid member', rpdoc_example_key: 400003, rpdoc_example_name: 'duplicate template failed (invalid member)', skip_auth: true do
      @headers['Authorization'] = 'Bearer invalid-token'
      post @path, params: @params.to_json, headers: @headers

      expect(response).to have_http_status(400)
      expect(json['error_code']).to eq(400003)
      expect(json['error_key']).to eq('invalid_member')
    end
  end
end
