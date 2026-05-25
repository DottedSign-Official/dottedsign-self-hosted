require 'rails_helper'

RSpec.describe Api::V1::TemplatesController, type: :request do
  include_context 'rpdoc'

  before(:each) do |example|
    example.metadata[:rpdoc_action_key] = 'show'
    example.metadata[:rpdoc_action_name] = 'show template detail'
    example.metadata[:rpdoc_example_folders] = ['v1', 'templates']

    @member = mock_member(:member_me, skip_auth: example.metadata[:skip_auth])
    @headers = {
      'Authorization' => 'Bearer {{rabbit_token}}'
    }
    @path = '/api/v1/templates'
    FactoryBot.create_list(:template, 10, owner: @member)
  end

  describe '#show' do
    before(:each) do
      @template = FactoryBot.create(:template, dummy_stage_count: 3)
      @path += "/#{@template.id}"
    end

    it 'should return 200 and get the template', rpdoc_example_key: 200, rpdoc_example_name: 'get template detail success' do
      get @path, headers: @headers
      expect(response).to have_http_status(200)
      expect(json['data']['template_id']).to eq(@template.id)
      expect(json['data']['file_name']).to eq(@template.file_name)
      expect(json['data']['owner_id']).to eq(@template.owner_id)
      expect(json['data']['has_order']).to eq(@template.has_order)
      expect(json['data']['status']).to eq(@template.status)
    end

    it 'should return 200 with field_setting_groups', rpdoc_example_key: 200_2, rpdoc_example_name: 'get template detail with field_setting_groups success' do |example|
      @template = FactoryBot.create(:template, owner: @member)
      get "/api/v1/templates/#{@template.id}", headers: @headers
      expect(response).to have_http_status(200)
      expect(json['data']['detail'][0]['field_setting_groups'].present?).to eq(true)
      expect(json['data']['detail'][0]['field_setting_groups'].size).to eq(2)
    end

    it 'should return 403044 if usage is public_form ', rpdoc_example_key: 403044, rpdoc_example_name: 'get template failed (invalid usage)' do |example|
      @template = FactoryBot.create(:template, owner: @member, usage: Template.usages[:public_form])
      get "/api/v1/templates/#{@template.id}", headers: @headers
      expect(response).to have_http_status(403)
      expect(json['error_code']).to eq(403044)
      expect(json['error_key']).to eq('template_not_accessible')
    end

    it 'should return 400003 if invalid member', rpdoc_example_key: 400003, rpdoc_example_name: 'get template detail failed (invalid member)', skip_auth: true do
      @headers['Authorization'] = 'Bearer invalid-token'
      get @path, headers: @headers
      expect(response).to have_http_status(400)
      expect(json['error_code']).to eq(400003)
      expect(json['error_key']).to eq('invalid_member')
    end
  end
end
