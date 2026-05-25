require 'rails_helper'

RSpec.describe '/api/home_controller#permissions', type: :request do
  include_context 'rpdoc'

  before(:each) do |example|
    example.metadata[:rpdoc_action_key] = 'permissions'
    example.metadata[:rpdoc_action_name] = '進階功能資訊'
    example.metadata[:rpdoc_example_folders] = ['home']

    @member = mock_member(:member_me)
    @headers = {
      'Authorization' => 'Bearer {{rabbit_token}}'
    }
  end

  context '#permissions' do
    before(:each) do
      @path = "/api/permissions"
    end

    it 'should return 200 (allow developer console)', rpdoc_example_key: 200_1, rpdoc_example_name: 'get permissions success (allow developer console)' do
      mock_developer
      get @path, headers: @headers
      expect(response).to have_http_status(200)
      expect(json['data']['developer_console']).to be(true)
    end

    it 'should return 200 (not allow developer console)', rpdoc_example_key: 200_2, rpdoc_example_name: 'get permissions success (not allow developer console)' do
      get @path, headers: @headers
      expect(response).to have_http_status(200)
      expect(json['data']['developer_console']).to be(false)
    end

    it 'should return 200 (allow group feature)', rpdoc_example_key: 200_3, rpdoc_example_name: 'get permissions success (allow group feature)' do
      stub_const('GROUP_USE', true)
      get @path, headers: @headers
      expect(response).to have_http_status(200)
      expect(json['data']['group_enable']).to be(true)
    end

    it 'should return 200 (not allow group feature)', rpdoc_example_key: 200_4, rpdoc_example_name: 'get permissions success (not allow group feature)' do
      stub_const('GROUP_USE', false)
      get @path, headers: @headers
      expect(response).to have_http_status(200)
      expect(json['data']['group_enable']).to be(false)
    end
  end

end
