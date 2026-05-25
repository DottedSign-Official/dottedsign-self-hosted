require 'rails_helper'

RSpec.describe Api::V1::Developer::MembersController, type: :request do
  include_context 'rpdoc'

  before(:each) do |example|
    example.metadata[:rpdoc_action_key] = 'modify_status'
    example.metadata[:rpdoc_action_name] = '更新會員狀態'
    example.metadata[:rpdoc_example_folders] = ['v1', 'developer', 'members']
    mock_developer
    @member = mock_member(:member_me)
    @headers = { 'Authorization' => 'Bearer {{rabbit_token}}', 'Content-Type' => 'application/json' }
    @path = "/api/v1/developer/members/modify_status"
    @params = {
      email: @member.email,
      status: 'inactive'
    }
  end

  context '#modify_status' do
    it 'should return 200', rpdoc_example_key: 200, rpdoc_example_name: 'modify member status' do
      put @path, params: @params.to_json, headers: @headers
      expect(response).to have_http_status(200)
      @member.reload
      expect(@member.status).to eq(@params[:status])
    end

    it 'should return 404201 if member is not found', rpdoc_example_key: 404201, rpdoc_example_name: 'email check failed (email not exist)' do
      @params[:email] = 'not-exist@test.com'
      put @path, params: @params.to_json, headers: @headers
      expect(response).to have_http_status(404)
      expect(json['error_code']).to eq(404201)
      expect(json['error_key']).to eq('member_not_found')
    end
  end

end
