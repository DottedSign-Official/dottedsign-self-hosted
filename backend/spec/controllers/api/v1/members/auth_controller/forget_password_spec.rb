require 'rails_helper'

RSpec.describe Api::V1::Members::AuthController, type: :request do
  include_context 'rpdoc'

  before(:each) do |example|
    example.metadata[:rpdoc_action_key] = 'forget_password'
    example.metadata[:rpdoc_action_name] = 'send forget password mail to member'
    example.metadata[:rpdoc_example_folders] = ['v1', 'members', 'auth']

    @member = mock_member(:member_me, skip_auth: example.metadata[:skip_auth])
    @headers = {
      'Content-Type' => 'application/json',
      'Authorization' => 'Bearer {{rabbit_token}}'
    }
    @path = '/api/v1/members/forget_password'
    mock_http_send
  end

  describe '#forget_password' do
    before(:each) do
      @params = {
        email: @member.email
      }
    end

    it 'should return 200', rpdoc_example_key: 200, rpdoc_example_name: 'send forget password mail success' do
      post @path, params: @params.to_json, headers: @headers
      expect(response).to have_http_status(200)
    end

    it 'should return 404201 if member is not found', rpdoc_example_key: 404201, rpdoc_example_name: 'send forget password mail failed (member not found)' do
      @params[:email] = 'not-found@test.com'
      post @path, params: @params.to_json, headers: @headers
      expect(response).to have_http_status(404)
      expect(json['error_code']).to eq(404201)
      expect(json['error_key']).to eq('member_not_found')
    end
  end

end
