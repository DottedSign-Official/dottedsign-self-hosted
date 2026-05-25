require 'rails_helper'

RSpec.describe Api::V1::Members::AuthController, type: :request do
  include_context 'rpdoc'

  before(:each) do |example|
    example.metadata[:rpdoc_action_key] = 'login'
    example.metadata[:rpdoc_action_name] = 'login member'
    example.metadata[:rpdoc_example_folders] = ['v1', 'members', 'auth']

    @member = mock_member(:member_me, skip_auth: example.metadata[:skip_auth])
    @headers = {
      'Content-Type' => 'application/json',
      'Authorization' => 'Bearer {{rabbit_token}}'
    }
    @path = '/api/v1/members/login'
  end

  describe '#login' do
    before(:each) do
      client = mock_client
      @params = {
        client_id: client.uid,
        client_secret: client.secret,
        email: @member.email,
        password: @member.password
      }
    end

    it 'should return 200 if login success', rpdoc_example_key: 200, rpdoc_example_name: 'login member success' do
      post @path, params: @params.to_json, headers: @headers
      expect(response).to have_http_status(200)
      access_token = Doorkeeper::AccessToken.last
      expect(json['data']['token_info']['token_type']).to eq('Bearer')
      expect(json['data']['token_info']['access_token']).to eq(access_token.token)
      expect(json['data']['token_info']['refresh_token']).to eq(access_token.refresh_token)
    end

    it 'should return 400003 if member is not found', rpdoc_example_key: 400003, rpdoc_example_name: 'login member failed (invalid email)' do
      @params[:email] = 'not-found@test.com'
      post @path, params: @params.to_json, headers: @headers
      expect(response).to have_http_status(400)
      expect(json['error_code']).to eq(400003)
      expect(json['error_key']).to eq('invalid_member')
    end

    it 'should return 400003 if password is incorrect', rpdoc_example_key: 400003, rpdoc_example_name: 'login member failed (invalid password)' do
      member = FactoryBot.create(:member_me)
      @params[:password] = 'incorrect-password'
      post @path, params: @params.to_json, headers: @headers
      expect(response).to have_http_status(400)
      expect(json['error_code']).to eq(400003)
      expect(json['error_key']).to eq('invalid_member')
    end

    it 'should return 404208', rpdoc_example_key: 404208, rpdoc_example_name: 'login member failed (client invalid)' do
      @params[:client_id] = 'fake_client_id'
      post @path, params: @params.to_json, headers: @headers
      expect(response).to have_http_status(404)
      expect(json['error_code']).to eq(404208)
      expect(json['error_key']).to eq('client_not_found')
    end
  end
end
