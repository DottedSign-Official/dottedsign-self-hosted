require 'rails_helper'

RSpec.describe Doorkeeper::TokensController, type: :request do
  include_context 'rpdoc'

  before(:each) do |example|
    example.metadata[:rpdoc_action_key] = 'refresh_token'
    example.metadata[:rpdoc_action_name] = 'Refresh Token'
    example.metadata[:rpdoc_example_folders] = ['OAuth']

    @app = mock_client
    @member = mock_member(:member_me, skip_auth: true)
    @token = mock_access_token(member: @member, app: @app)
    @headers = {
      'Content-Type' => 'application/json'
    }
  end

  describe '#tasks' do
    before(:each) do
      @path = '/oauth/token'
      @params = {
        client_id: @app.uid,
        client_secret: @app.secret,
        grant_type: 'refresh_token',
        refresh_token: @token.refresh_token
      }
    end

    it 'should return 200', rpdoc_example_key: 200, rpdoc_example_name: 'Refresh success' do
      post @path, headers: @headers, params: @params.to_json
      expect(response).to have_http_status(200)
      expect(Doorkeeper::AccessToken.find_by(resource_owner_id: @member.id, token: json['access_token'])).to be_present
    end

    it 'should return 401_001 if password is incorrect', rpdoc_example_key: 401_001, rpdoc_example_name: 'Refresh failed (token incorrect)' do
      @params[:refresh_token] = 'incorrect_token'
      post @path, headers: @headers, params: @params.to_json
      expect(response).to have_http_status(400)
      expect(json['error_code']).to eq(401_001)
    end
  end

end
