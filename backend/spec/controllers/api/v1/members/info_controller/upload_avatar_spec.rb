require 'rails_helper'

RSpec.describe Api::V1::Members::InfoController, type: :request do
  include_context 'rpdoc'

  before(:each) do |example|
    example.metadata[:rpdoc_action_key] = 'upload_avatar'
    example.metadata[:rpdoc_action_name] = 'upload member avatar'
    example.metadata[:rpdoc_example_folders] = ['v1','members', 'info']

    @member = mock_member(:member_me, skip_auth: example.metadata[:skip_auth])
    @headers = {
      'Content-Type' => 'multipart/form-data',
      'Authorization' => 'Bearer {{rabbit_token}}'
    }
    @path = '/api/v1/members/upload_avatar'
    mock_upload
  end

  describe '#upload_avatar' do
    before(:each) do
      @params = {
        avatar: fixture_file_upload('kdan.png', 'image/png')
      }
    end

    it 'should return 200', rpdoc_example_key: 200, rpdoc_example_name: 'upload member avatar success' do
      post @path, params: @params, headers: @headers
      expect(response).to have_http_status(200)
    end

    it 'should return 400003 if invalid member', rpdoc_example_key: 400003, rpdoc_example_name: 'upload member avatar failed (invalid member)', skip_auth: true do
      @headers['Authorization'] = 'Bearer invalid-token'
      post @path, params: @params, headers: @headers
      expect(response).to have_http_status(400)
      expect(json['error_code']).to eq(400003)
      expect(json['error_key']).to eq('invalid_member')
    end
  end
end
