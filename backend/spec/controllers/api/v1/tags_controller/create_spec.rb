require 'rails_helper'

RSpec.describe Api::V1::TagsController, type: :request do
  include_context 'rpdoc'

  before(:each) do |example|
    example.metadata[:rpdoc_action_key] = 'create'
    example.metadata[:rpdoc_action_name] = 'create tag'
    example.metadata[:rpdoc_example_folders] = ['v1', 'tags']

    @headers = {
      'Content-Type' => 'application/json',
      'Authorization' => 'Bearer {{rabbit_token}}'
    }
    @member = mock_member(:member_me, skip_auth: example.metadata[:skip_auth])
    @path = '/api/v1/tags'
  end

  describe '#create' do
    before(:each) do
      @params = {
        new_tag: 'New Tag'
      }
    end

    it 'should return 200 and create success', rpdoc_example_key: 200, rpdoc_example_name: 'create tag success' do
      post @path, params: @params.to_json, headers: @headers
      expect(response).to have_http_status(200)
      expect(@member.tag_list.length).to eq(1)
    end

    it 'should return 400054 if tag already exists', rpdoc_example_key: 400054, rpdoc_example_name: 'create tag failed (tag already exists)' do
      @member.tag_list.add(['Tag 1'])
      @member.save
      @params[:new_tag] = 'Tag 1'
      post @path, params: @params.to_json, headers: @headers
      expect(response).to have_http_status(400)
      expect(json['error_code']).to eq(400054)
    end

    it 'should return 400055 and create success', rpdoc_example_key: 400055, rpdoc_example_name: 'create tag failed (tag is empty)' do
      @params[:new_tag] = ''
      post @path, params: @params.to_json, headers: @headers
      expect(response).to have_http_status(400)
      expect(json['error_code']).to eq(400055)
      expect(json['error_key']).to eq('empty_tag_not_allowed')
    end

    it 'should return 400064 if tag is too long', rpdoc_example_key: 400064, rpdoc_example_name: 'create tag failed (tag is too long)' do
      @params[:new_tag] = 'tag' * 100
      post @path, params: @params.to_json, headers: @headers
      expect(response).to have_http_status(400)
      expect(json['error_code']).to eq(400064)
      expect(json['error_key']).to eq('tag_name_is_too_long')
    end

    it 'should return 400003 if invalid member', rpdoc_example_key: 400003, rpdoc_example_name: 'create tag failed (invalid member)', skip_auth: true do
      @headers['Authorization'] = 'Bearer invalid-token'
      post @path, params: @params.to_json, headers: @headers
      expect(response).to have_http_status(400)
      expect(json['error_code']).to eq(400003)
      expect(json['error_key']).to eq('invalid_member')
    end
  end
end
