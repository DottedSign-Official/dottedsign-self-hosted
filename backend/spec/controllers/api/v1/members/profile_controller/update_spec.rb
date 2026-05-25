require 'rails_helper'

RSpec.describe Api::V1::Members::ProfileController, type: :request do
  include_context 'rpdoc'

  before(:each) do |example|
    example.metadata[:rpdoc_action_key] = 'update'
    example.metadata[:rpdoc_action_name] = 'update member profile'
    example.metadata[:rpdoc_example_folders] = ['v1','members', 'profile']

    @member = mock_member(:member_me, skip_auth: example.metadata[:skip_auth])
    @headers = {
      'Content-Type' => 'application/json',
      'Authorization' => 'Bearer {{rabbit_token}}'
    }
    @path = '/api/v1/members/profile'
  end

  describe '#update' do
    before(:each) do
      @params = {
        full_name: 'modified full_name',
        first_name: 'modified_first_name'
      }
    end

    it 'should return 200 and get modified profile', rpdoc_example_key: 200, rpdoc_example_name: 'update member profile success' do
      profile = @member.profile
      put @path, params: @params.to_json, headers: @headers
      expect(response).to have_http_status(200)
      expect(json['data']['full_name']).to eq(@params[:full_name])
      expect(json['data']['first_name']).to eq(@params[:first_name])
      expect(json['data']['language']).to eq(profile.language)
      expect(json['data']['telephone']).to eq(profile.telephone)
      expect(json['data']['nationality']).to eq(profile.nationality)
      expect(json['data']['address']).to eq(profile.address)
      expect(json['data']['organization']).to eq(profile.organization)
    end

    it 'should return 400003 if invalid member', rpdoc_example_key: 400003, rpdoc_example_name: 'update member profile failed (invalid member)', skip_auth: true do
      @headers['Authorization'] = 'Bearer invalid-token'
      put @path, params: @params.to_json, headers: @headers
      expect(response).to have_http_status(400)
      expect(json['error_code']).to eq(400003)
      expect(json['error_key']).to eq('invalid_member')
    end
  end
end
