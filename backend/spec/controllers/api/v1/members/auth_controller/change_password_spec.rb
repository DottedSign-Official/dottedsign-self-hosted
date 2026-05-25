require 'rails_helper'

RSpec.describe Api::V1::Members::AuthController, type: :request do
  include_context 'rpdoc'

  before(:each) do |example|
    example.metadata[:rpdoc_action_key] = 'change_password'
    example.metadata[:rpdoc_action_name] = 'change member password'
    example.metadata[:rpdoc_example_folders] = ['v1', 'members', 'auth']

    @member = mock_member(:member_me)
    @path = '/api/v1/members/change_password'
    @headers = { 'Content-Type' => 'application/json', 'Authorization' => 'Bearer {{rabbit_token}}' }
    @params = {
      old_password: 'testtest',
      password: 'change-password',
      password_confirmation: 'change-password'
    }
    mock_http_send
  end

  describe '#change_password' do
    it 'should return 200', rpdoc_example_key: 200, rpdoc_example_name: 'reset member password success' do
      put @path, params: @params.to_json, headers: @headers

      @member.reload
      expect(response).to have_http_status(200)
      expect(@member.password).to eq('change-password')
    end

    it 'should return 400_001 if not found old_passwrod params', rpdoc_example_key: 400_001, rpdoc_example_name: '400_001(need_more_information)' do
      @params[:old_password] = ''
      put @path, params: @params.to_json, headers: @headers

      expect(response).to have_http_status(400)
      expect(json['error_code']).to eq(400_001)
      expect(json['error_key']).to eq('need_more_information')
    end

    it 'should return 401_204 if old password not match', rpdoc_example_key: 401_204, rpdoc_example_name: '401_204(password_not_match)' do
      @params[:old_password] = 'test'
      put @path, params: @params.to_json, headers: @headers

      expect(response).to have_http_status(401)
      expect(json['error_code']).to eq(401_204)
      expect(json['error_key']).to eq('password_not_match')
    end

    it 'should return 401_209 if password confirmation not match', rpdoc_example_key: 401_209, rpdoc_example_name: '401_209(password confirmation not match)' do
      @params[:password] = 'change'
      put @path, params: @params.to_json, headers: @headers

      expect(response).to have_http_status(401)
      expect(json['error_code']).to eq(401_209)
      expect(json['error_key']).to eq('password_and_confirmation_not_match')
    end

    it 'should return 401_210 if password same as last modification', rpdoc_example_key: 401_210, rpdoc_example_name: '401_210(password_same_as_last_modification)' do
      @params[:password] = 'testtest'
      @params[:password_confirmation] = 'testtest'
      put @path, params: @params.to_json, headers: @headers

      expect(response).to have_http_status(401)
      expect(json['error_code']).to eq(401_210)
      expect(json['error_key']).to eq('password_same_as_last_modification')
    end
  end

end
