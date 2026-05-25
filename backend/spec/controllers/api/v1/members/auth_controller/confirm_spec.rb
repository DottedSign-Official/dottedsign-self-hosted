require 'rails_helper'

RSpec.describe Api::V1::Members::AuthController, type: :request do
  include_context 'rpdoc'

  before(:each) do |example|
    example.metadata[:rpdoc_action_key] = 'confirm'
    example.metadata[:rpdoc_action_name] = 'confirm member'
    example.metadata[:rpdoc_example_folders] = ['v1', 'members', 'auth']

    @member = mock_member(:not_confirmed_member)
    mock_http_send
    @member.send_confirmation_instructions
    @headers = {
      'Content-Type' => 'application/json',
      'Authorization' => 'Bearer {{rabbit_token}}'
    }
    @path = '/api/v1/members/confirm'
  end

  describe '#confirm' do
    before(:each) do
      @params = {
        confirmation_token: @member.confirmation_token
      }
    end

    it 'should return 200 if confirm success', rpdoc_example_key: 200, rpdoc_example_name: 'confirm member success' do
      post @path, params: @params.to_json, headers: @headers
      expect(response).to have_http_status(200)
    end

    it 'should return 400002 if token is invalid', rpdoc_example_key: 400002, rpdoc_example_name: 'confirm member failed (confirm token invalid)' do
      @params[:confirmation_token] = 'invalid-token'
      post @path, params: @params.to_json, headers: @headers
      expect(response).to have_http_status(400)
      expect(json['error_code']).to eq(400002)
      expect(json['error_key']).to eq('invalid_token')
    end
  end

end
