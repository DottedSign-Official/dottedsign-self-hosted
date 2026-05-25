require 'rails_helper'

RSpec.describe Api::V1::TemplatesController, type: :request do
  include_context 'rpdoc'

  before(:each) do |example|
    example.metadata[:rpdoc_action_key] = 'index'
    example.metadata[:rpdoc_action_name] = 'list templates'
    example.metadata[:rpdoc_example_folders] = ['v1', 'templates']

    @member = mock_member(:member_me, skip_auth: example.metadata[:skip_auth])
    @headers = {
      'Authorization' => 'Bearer {{rabbit_token}}'
    }
    @path = '/api/v1/templates'
    FactoryBot.create(:template, usage: Template.usages[:public_form])
    FactoryBot.create_list(:template, 5, owner: @member)
    FactoryBot.create_list(:template, 5, owner: @member, with_review_stage: true)
  end

  describe '#index' do
    before(:each) do
      @params = {
        page: 2,
        per_page: 3
      }
    end

    it 'should return 200 and get template list by pagination', rpdoc_example_key: 200_1, rpdoc_example_name: 'list templates success (list page 2 templates)' do
      get @path, params: @params, headers: @headers
      expect(response).to have_http_status(200)
      expect(json['data']['templates'].length).to eq(3)
      expect(json['data']['total_count']).to eq(10)
      expect(json['data']['current_page']).to eq(2)
      expect(json['data']['total_pages']).to eq(4)
    end

    it 'should return 200 and get template without review stages', rpdoc_example_key: '200_without_review_stages', rpdoc_example_name: 'list templates success (without review stages)' do
      get @path, params: @params.merge(exclude_actions: ['review']), headers: @headers
      expect(response).to have_http_status(200)
      expect(json['data']['templates'].length).to eq(2)
      expect(json['data']['total_count']).to eq(5)
      expect(json['data']['current_page']).to eq(2)
      expect(json['data']['total_pages']).to eq(2)
    end

    it 'should get templates by search keys(file_name)', rpdoc_example_key: 200_2, rpdoc_example_name: 'list templates success (list matched terms templates)' do
      template = Template.last
      params = {terms: template.file_name}
      get @path, params: params, headers: @headers
      expect(json['data']['templates'].length).to eq(1)
      expect(json['data']['total_count']).to eq(1)
    end

    it 'should get templates by search keys(code)', rpdoc_example_key: 200_3, rpdoc_example_name: 'list templates success (list matched code templates)' do
      template = Template.last
      params = {code: template.code}
      get @path, params: params, headers: @headers
      expect(json['data']['templates'].length).to eq(1)
      expect(json['data']['total_count']).to eq(1)
    end

    it 'should return 400003 if invalid member', rpdoc_example_key: 400003, rpdoc_example_name: 'list templates failed (invalid member)', skip_auth: true do
      @headers['Authorization'] = 'Bearer invalid-token'
      get @path, params: @params, headers: @headers
      expect(response).to have_http_status(400)
      expect(json['error_code']).to eq(400003)
      expect(json['error_key']).to eq('invalid_member')
    end
  end
end
