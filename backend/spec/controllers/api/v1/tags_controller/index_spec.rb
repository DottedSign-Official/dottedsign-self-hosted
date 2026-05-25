require 'rails_helper'

RSpec.describe Api::V1::TagsController, type: :request do
  include_context 'rpdoc'

  before(:each) do |example|
    example.metadata[:rpdoc_action_key] = 'index'
    example.metadata[:rpdoc_action_name] = 'list tag'
    example.metadata[:rpdoc_example_folders] = ['v1', 'tags']

    @member = mock_member(:member_me, skip_auth: example.metadata[:skip_auth])
    @headers = {
      'Authorization' => 'Bearer {{rabbit_token}}'
    }
    @path = '/api/v1/tags'
  end

  describe '#index' do

    it 'should return 200 and get tag list', rpdoc_example_key: 200, rpdoc_example_name: 'list tags success' do
      @member.tag_list.add(['Tag 1'])
      @member.tag_list.add(['Tag 2', 'Tag 3'])
      @member.save
      get @path, headers: @headers
      expect(response).to have_http_status(200)
      expect(json['data'].length).to eq(3)
      expect(json['data']).to match_array(['Tag 1', 'Tag 2', 'Tag 3'])
    end

    it 'should return 200 and get tag list with search_name', rpdoc_example_key: 200_2, rpdoc_example_name: 'list tags success with search_name' do
      tags_array = ['Tag 1', 'Tag 2', 'Tag 3']
      @member.tag_list.add(tags_array)
      @member.save
      params = { search_name: 'Tag' }
      get "#{@path}?#{URI.encode_www_form(params)}", headers: @headers
      expect(response).to have_http_status(200)
      expect(json['data'].length).to eq(tags_array.length)
      expect(json['data']).to match_array(tags_array)
    end

    it 'should return 400003 if invalid member', rpdoc_example_key: 400003, rpdoc_example_name: 'list tags failed (invalid member)', skip_auth: true do
      @headers['Authorization'] = 'Bearer invalid-token'
      get @path, headers: @headers
      expect(response).to have_http_status(400)
      expect(json['error_code']).to eq(400003)
      expect(json['error_key']).to eq('invalid_member')
    end
  end
end
