require 'rails_helper'

RSpec.describe Api::V1::Members::InfoController, type: :request do
  include_context 'rpdoc'

  before(:each) do |example|
    example.metadata[:rpdoc_action_key] = 'me'
    example.metadata[:rpdoc_action_name] = 'get member info'
    example.metadata[:rpdoc_example_folders] = ['v1','members', 'info']

    @member = mock_member(:member_me, skip_auth: example.metadata[:skip_auth])
    @headers = {'Authorization' => 'Bearer {{rabbit_token}}'}
    @path = '/api/v1/members/me'
  end

  describe '#me' do

    it 'should return 200 and get member info as well as preferences', rpdoc_example_key: 200, rpdoc_example_name: 'get member info with preferences success' do
      get @path, headers: @headers
      expect(response).to have_http_status(200)
      expect(json['data']['email']).to eq(@member.email)
      expect(json['data']['name']).to eq(@member.name)
      expect(json['data']['confirmed']).to eq(@member.confirmed?)
      expect(json['data']['preference']['date_format']).to eq(@member.preferences['date_format'])
      expect(json['data']['preference']['forget_remind']).to eq(@member.preferences['forget_remind'])
      expect(json['data']['preference']['expire_remind']).to eq(@member.preferences['expire_remind'])
      expect(json['data']['preference']['remind_days_before_expire']).to eq(@member.preferences['remind_days_before_expire'])
      expect(json['data']['preference']['otp_via_email']).to eq(@member.preferences['otp_via_email'])
      expect(json['data']['preference']['otp_via_phone']).to eq(@member.preferences['otp_via_phone'])
      expect(json['data']['preference']['receiver_lang']).to eq(@member.preferences['receiver_lang'])
      expect(json['data']['preference']['force_receiver_otp']).to eq(@member.preferences['force_receiver_otp'])
    end

    it 'should return 400003 if invalid member', rpdoc_example_key: 400003, rpdoc_example_name: 'get member info with preferences failed (invalid member)', skip_auth: true do
      @headers['Authorization'] = 'Bearer invalid-token'
      get @path, headers: @headers
      expect(response).to have_http_status(400)
      expect(json['error_code']).to eq(400003)
      expect(json['error_key']).to eq('invalid_member')
    end
  end
end
