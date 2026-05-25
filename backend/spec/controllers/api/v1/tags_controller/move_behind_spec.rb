require 'rails_helper'

RSpec.describe Api::V1::TagsController, type: :request do
  include_context 'rpdoc'

  before(:each) do |example|
    example.metadata[:rpdoc_action_key] = 'move_behind'
    example.metadata[:rpdoc_action_name] = 'move tag behind other tag'
    example.metadata[:rpdoc_example_folders] = ['v1', 'tags']

    @headers = {
      'Content-Type' => 'application/json',
      'Authorization' => 'Bearer {{rabbit_token}}'
    }
    @member = mock_member(:member_me, skip_auth: example.metadata[:skip_auth])
    @path = '/api/v1/tags/move_behind'
    @member.tag_list.add(['Tag 1', 'Tag 2', 'Tag 3'])
    @member.save
  end

  describe '#move_behind' do
    before(:each) do
      @params = {
        move_tag: 'Tag 3',
        behind_tag: 'Tag 1'
      }
    end

    it 'should retrun 200 and move the third tag to the second', rpdoc_example_key: 200_1, rpdoc_example_name: 'move tag behind other tag success' do
      put @path, params: @params.to_json, headers: @headers
      expect(response).to have_http_status(200)
      expect(json['data']).to match_array(['Tag 1', 'Tag 3', 'Tag 2'])
    end

    it 'should move the third tag to the first', rpdoc_example_key: 200_2, rpdoc_example_name: 'move tag behind other tag success (move to the head of tag list)' do
      @params.delete(:behind_tag)
      put @path, params: @params.to_json, headers: @headers
      expect(response).to have_http_status(200)
      expect(json['data']).to match_array(['Tag 3', 'Tag 1', 'Tag 2'])
    end

    it 'should return 404037 if moved tag is not found', rpdoc_example_key: 404037, rpdoc_example_name: 'move tag behind other tag failed (moved tag not found)' do
      @params[:move_tag] = 'Tag Not Found'
      put @path, params: @params.to_json, headers: @headers
      expect(response).to have_http_status(404)
      expect(json['error_code']).to eq(404037)
    end

    it 'should return 406033 if move tag failed', rpdoc_example_key: 400003, rpdoc_example_name: 'move tag behind other tag failed (behind tag not found)' do
      @params[:behind_tag] = 'Tag Not Found'
      put @path, params: @params.to_json, headers: @headers
      expect(response).to have_http_status(406)
      expect(json['error_code']).to eq(406033)
    end

    it 'should return 400003 if invalid member', rpdoc_example_key: 400003, rpdoc_example_name: 'move tag behind other tag failed (invalid member)', skip_auth: true do
      @headers['Authorization'] = 'Bearer invalid-token'
      put @path, params: @params.to_json, headers: @headers
      expect(response).to have_http_status(400)
      expect(json['error_code']).to eq(400003)
      expect(json['error_key']).to eq('invalid_member')
    end
  end
end
