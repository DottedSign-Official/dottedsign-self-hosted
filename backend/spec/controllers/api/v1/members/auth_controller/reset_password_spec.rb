require 'rails_helper'

RSpec.describe Api::V1::Members::AuthController, type: :request do
  include_context 'rpdoc'

  before(:each) do |example|
    example.metadata[:rpdoc_action_key] = 'reset_password'
    example.metadata[:rpdoc_action_name] = 'reset member password'
    example.metadata[:rpdoc_example_folders] = ['v1', 'members', 'auth']

    @member = mock_member(:member_me, skip_auth: example.metadata[:skip_auth])
    @raw, enc = Devise.token_generator.generate(Member, :reset_password_token)
    @member.update(
      reset_password_token: enc,
      reset_password_sent_at: Time.now.utc
    )
    @headers = {
      'Content-Type' => 'application/json',
      'Authorization' => 'Bearer {{rabbit_token}}'
    }
    @path = '/api/v1/members/reset_password'
    mock_http_send
  end

  describe '#reset_password' do
    before(:each) do
      @params = {
        reset_password_token: @raw,
        password: 'reset-password',
        password_confirmation: 'reset-password'
      }
    end

    it 'should return 200', rpdoc_example_key: 200, rpdoc_example_name: 'reset member password success' do
      put @path, params: @params.to_json, headers: @headers
      expect(response).to have_http_status(200)
    end

    it 'should return 401_203 if member is not found', rpdoc_example_key: 401_203, rpdoc_example_name: '401_203(reset token invalid)' do
      @params[:reset_password_token] = 'invalid-token'
      put @path, params: @params.to_json, headers: @headers
      expect(response).to have_http_status(401)
      expect(json['error_code']).to eq(401_203)
      expect(json['error_key']).to eq('token_invalid')
    end

    it 'should return 401_209 if password and confirmation not match', rpdoc_example_key: 401_209, rpdoc_example_name: '401_209(password_and_confirmation_not_match)' do
      @params[:password_confirmation] = 'not-match-password'
      put @path, params: @params.to_json, headers: @headers
      
      expect(response).to have_http_status(401)
      expect(json['error_code']).to eq(401_209)
      expect(json['error_key']).to eq('password_and_confirmation_not_match')
    end
  end

end
