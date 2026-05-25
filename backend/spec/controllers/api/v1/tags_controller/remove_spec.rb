require 'rails_helper'

RSpec.describe Api::V1::TagsController, type: :request do
  include_context 'rpdoc'

  before(:each) do |example|
    example.metadata[:rpdoc_action_key] = 'remove'
    example.metadata[:rpdoc_action_name] = 'remove tag'
    example.metadata[:rpdoc_example_folders] = ['v1', 'tags']

    @headers = {
      'Content-Type' => 'application/json',
      'Authorization' => 'Bearer {{rabbit_token}}'
    }
    @member = mock_member(:member_me, skip_auth: example.metadata[:skip_auth])
    @path = '/api/v1/tags/remove'
  end

  describe '#remove' do
    before(:each) do
      @params = {
        remove_tag: 'Tag 1'
      }
    end

    it 'should return 200 if delete success', rpdoc_example_key: 200, rpdoc_example_name: 'remove tag success' do
      @member.tag_list.add(['Tag 1', 'Tag 2'])
      @member.save
      delete @path, params: @params.to_json, headers: @headers
      expect(response).to have_http_status(200)
      expect(json['data'].length).to eq(1)
      expect(json['data'][0]).to eq('Tag 2')
    end

    it 'should return 400003 if invalid member', rpdoc_example_key: 400003, rpdoc_example_name: 'remove tag failed (invalid member)', skip_auth: true do
      @headers['Authorization'] = 'Bearer invalid-token'
      delete @path, params: @params.to_json, headers: @headers
      expect(response).to have_http_status(400)
      expect(json['error_code']).to eq(400003)
      expect(json['error_key']).to eq('invalid_member')
    end
  end
end
