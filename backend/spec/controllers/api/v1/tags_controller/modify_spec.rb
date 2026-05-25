require 'rails_helper'

RSpec.describe Api::V1::TagsController, type: :request do
  include_context 'rpdoc'

  before(:each) do |example|
    example.metadata[:rpdoc_action_key] = 'modify'
    example.metadata[:rpdoc_action_name] = 'modify tag'
    example.metadata[:rpdoc_example_folders] = ['v1', 'tags']

    @headers = {
      'Content-Type' => 'application/json',
      'Authorization' => 'Bearer {{rabbit_token}}'
    }
    @member = mock_member(:member_me, skip_auth: example.metadata[:skip_auth])
    @path = '/api/v1/tags/modify'
  end

  describe '#modify' do
    before(:each) do
      @params = {
        old_tag: 'Tag 1',
        new_tag: 'New Tag'
      }
    end

    it 'should return 200 if modify success', rpdoc_example_key: 200, rpdoc_example_name: 'modify tag success' do
      @member.tag_list.add(['Tag 1', 'Tag 2'])
      @member.save
      put @path, params: @params.to_json, headers: @headers

      @member.reload
      expect(response).to have_http_status(200)
      expect(json['data'].length).to eq(2)
      expect(json['data']).to match_array(['New Tag', 'Tag 2'])
    end

    it 'should return 400055 if there is empty new tag', rpdoc_example_key: 400055, rpdoc_example_name: 'modify tag failed (new tag is empty)' do
      @params[:new_tag] = ''
      put @path, params: @params.to_json, headers: @headers
      expect(response).to have_http_status(400)
      expect(json['error_code']).to eq(400055)
    end

    it 'should return 404037 if old tag is not found', rpdoc_example_key: 400003, rpdoc_example_name: 'modify tag failed (old tag not found)' do
      @member.tag_list.add(['Tag 1'])
      @member.save
      @params[:old_tag] = 'Tag Not Found'
      put @path, params: @params.to_json, headers: @headers
      expect(response).to have_http_status(404)
      expect(json['error_code']).to eq(404037)
    end

    it 'should return 400054 if tag already exists', rpdoc_example_key: 400003, rpdoc_example_name: 'modify tag failed (tag already exists)' do
      @member.tag_list.add(['Tag 1', 'Tag 2'])
      @member.save
      @params.merge!({
        old_tag: 'Tag 1',
        new_tag: 'Tag 2'
      })
      put @path, params: @params.to_json, headers: @headers
      expect(response).to have_http_status(400)
      expect(json['error_code']).to eq(400054)
    end

    it 'should return 400003 if invalid member', rpdoc_example_key: 400003, rpdoc_example_name: 'modify tag failed (invalid member)', skip_auth: true do
      @headers['Authorization'] = 'Bearer invalid-token'
      put @path, params: @params.to_json, headers: @headers
      expect(response).to have_http_status(400)
      expect(json['error_code']).to eq(400003)
      expect(json['error_key']).to eq('invalid_member')
    end
  end
end
