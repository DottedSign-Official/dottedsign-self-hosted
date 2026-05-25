require 'rails_helper'

RSpec.describe Api::V1::Members::InfoController, type: :request do
  include_context 'rpdoc'

  before(:each) do |example|
    example.metadata[:rpdoc_action_key] = 'preference'
    example.metadata[:rpdoc_action_name] = 'update member preference'
    example.metadata[:rpdoc_example_folders] = ['v1','members', 'info']

    @member = mock_member(:member_me, skip_auth: example.metadata[:skip_auth])
    @headers = {
      'Content-Type' => 'application/json',
      'Authorization' => 'Bearer {{rabbit_token}}'
    }
    @path = '/api/v1/members/preference'
  end

  describe '#preference' do
    before(:each) do
      @original_preference = @member.preferences
      @params = {
        forget_remind: !@original_preference['forget_remind'],
        otp_via_email: !@original_preference['otp_via_email']
      }
    end

    it 'should return 200 and update preference', rpdoc_example_key: 200, rpdoc_example_name: 'update member preferences success' do
      put @path, params: @params.to_json, headers: @headers
      expect(response).to have_http_status(200)
      expect(json['data']['preference']['forget_remind']).to eq(@params[:forget_remind])
      expect(json['data']['preference']['otp_via_email']).to eq(@params[:otp_via_email])
      expect(json['data']['preference']['expire_remind']).to eq(@original_preference['expire_remind'])
      expect(json['data']['preference']['otp_via_phone']).to eq(@original_preference['otp_via_phone'])
    end

    it 'should return 400003 if invalid member', rpdoc_example_key: 400003, rpdoc_example_name: 'update member preferences failed (invalid member)', skip_auth: true do
      @headers['Authorization'] = 'Bearer invalid-token'
      put @path, params: @params.to_json, headers: @headers
      expect(response).to have_http_status(400)
      expect(json['error_code']).to eq(400003)
      expect(json['error_key']).to eq('invalid_member')
    end
  end
end
