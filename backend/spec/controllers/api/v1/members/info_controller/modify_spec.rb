require 'rails_helper'

RSpec.describe Api::V1::Members::InfoController, type: :request do
  include_context 'rpdoc'

  before(:each) do |example|
    example.metadata[:rpdoc_action_key] = 'modify'
    example.metadata[:rpdoc_action_name] = 'modify member info'
    example.metadata[:rpdoc_example_folders] = ['v1','members', 'info']

    @member = mock_member(:member_me, skip_auth: example.metadata[:skip_auth])
    @headers = {
      'Content-Type' => 'application/json',
      'Authorization' => 'Bearer {{rabbit_token}}'
    }
    @path = '/api/v1/members/modify'
  end

  describe '#modify' do
    before(:each) do
      @params = {
        name: 'Modified Name',
        lang: 'zh-tw'
      }
    end

    it 'should return true and only given parameters are modified', rpdoc_example_key: 200, rpdoc_example_name: 'modify member info success' do
      put @path, params: @params.to_json, headers: @headers
      expect(response).to have_http_status(200)
      expect(json['data']['name']).to eq(@params[:name])
      expect(json['data']['language']).to eq(LangHandle.upcase_lang(@params[:lang]))
      expect(json['data']['preference']['forget_remind']).to eq(@member.preferences['forget_remind'])
      expect(json['data']['preference']['expire_remind']).to eq(@member.preferences['expire_remind'])
    end

    it 'should return 400010 if invalid language', rpdoc_example_key: 400, rpdoc_example_name: 'update member info failed (invalid language)' do
      params = @params.merge(lang: 'ja')
      put @path, params: params.to_json, headers: @headers
      expect(response).to have_http_status(400)
      expect(json['error_code']).to eq(400010)
      expect(json['error_key']).to eq('invalid_language')
    end

    it 'should return 400003 if invalid member', rpdoc_example_key: 400003, rpdoc_example_name: 'update member info failed (invalid member)', skip_auth: true do
      @headers['Authorization'] = 'Bearer invalid-token'
      put @path, params: @params.to_json, headers: @headers
      expect(response).to have_http_status(400)
      expect(json['error_code']).to eq(400003)
      expect(json['error_key']).to eq('invalid_member')
    end
  end
end
