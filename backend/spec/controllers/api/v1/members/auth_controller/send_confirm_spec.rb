require 'rails_helper'

RSpec.describe Api::V1::Members::AuthController, type: :request do
  include_context 'rpdoc'

  before(:each) do |example|
    example.metadata[:rpdoc_action_key] = 'send_confirm'
    example.metadata[:rpdoc_action_name] = 'send confirm email'
    example.metadata[:rpdoc_example_folders] = ['v1','members', 'auth']

    @member = mock_member(:not_confirmed_member)
    @headers = {
      'Content-Type' => 'application/json',
      'Authorization' => 'Bearer {{rabbit_token}}'
    }
    @path = '/api/v1/members/send_confirm'
    mock_http_send
  end

  describe '#send_confirm' do
    before(:each) do
      @params = {
        email: @member.email
      }
    end

    it 'should return 200', rpdoc_example_key: 200, rpdoc_example_name: 'send confirm email success' do
      post @path, params: @params.to_json, headers: @headers
      expect(response).to have_http_status(200)
    end

    it 'should return 400202 if member is already confirmed', rpdoc_example_key: 400202, rpdoc_example_name: 'send confirm email failed (member is already confirmed)' do
      member = mock_member(:member_me)
      @params[:email] = member.email
      post @path, params: @params.to_json, headers: @headers
      expect(response).to have_http_status(400)
      expect(json['error_code']).to eq(400202)
      expect(json['error_key']).to eq('already_confirmed')
    end
  end
end
