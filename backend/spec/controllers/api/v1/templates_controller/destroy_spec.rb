require 'rails_helper'

RSpec.describe Api::V1::TemplatesController, type: :request do
  include_context 'rpdoc'

  before(:each) do |example|
    example.metadata[:rpdoc_action_key] = 'destroy'
    example.metadata[:rpdoc_action_name] = 'delete template'
    example.metadata[:rpdoc_example_folders] = ['v1', 'templates']

    @member = mock_member(:member_me, skip_auth: example.metadata[:skip_auth])
    @headers = {
      'Content-Type' => 'application/json',
      'Authorization' => 'Bearer {{rabbit_token}}'
    }
    @path = '/api/v1/templates'
    FactoryBot.create_list(:template, 3, dummy_stage_count: 3)
  end

  describe '#destroy' do
    before(:each) do
      @template = Template.last
      @path += "/#{@template.id}"
    end

    it 'should return 200 and destroy success', rpdoc_example_key: 200, rpdoc_example_name: 'delete template success' do
      delete @path, headers: @headers

      @template.reload
      expect(response).to have_http_status(200)
      expect(Template.active.count).to eq(2)
      expect(@template.status).to eq('deleted')
    end

    it 'should return 404035 if template not found', rpdoc_example_key: 404035, rpdoc_example_name: 'delete template failed (template not found)' do
      @path = '/api/v1/templates/0'
      delete @path, headers: @headers
      expect(response).to have_http_status(404)
      expect(json['error_code']).to eq(404035)
      expect(json['error_key']).to eq('template_not_found')
    end

    it 'should return 400053 if template already deleted', rpdoc_example_key: 400053, rpdoc_example_name: 'delete template failed (template already deleted)' do
      @template.deleted!
      delete @path, headers: @headers
      expect(response).to have_http_status(400)
      expect(json['error_code']).to eq(400053)
      expect(json['error_key']).to eq('template_deleted')
    end

    it 'should return 403044 if template not owned', rpdoc_example_key: 403044, rpdoc_example_name: 'delete template failed (not template owner)' do
      mock_member(:member_a)
      delete @path, headers: @headers
      expect(response).to have_http_status(403)
      expect(json['error_code']).to eq(403044)
      expect(json['error_key']).to eq('template_not_accessible')
    end

    it 'should return 400003 if invalid member', rpdoc_example_key: 400003, rpdoc_example_name: 'delete template failed (invalid member)', skip_auth: true do
      @headers['Authorization'] = 'Bearer invalid-token'
      delete @path, headers: @headers
      expect(response).to have_http_status(400)
      expect(json['error_code']).to eq(400003)
      expect(json['error_key']).to eq('invalid_member')
    end

    it 'should return 400_1314', rpdoc_example_key: 400_1314, rpdoc_example_name: 'delete template failed (template sharing group )' do
      @group = mock_group(@member)
      ShareSetting.create!(shared: @template, target: @group)
      delete @path, headers: @headers
      expect(response).to have_http_status(400)
      expect(json['error_code']).to eq(4001314)
    end
  end
end
