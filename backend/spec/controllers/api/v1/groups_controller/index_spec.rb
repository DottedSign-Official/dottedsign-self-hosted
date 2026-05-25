require 'rails_helper'

RSpec.describe '/api/v1/groups_controller#index', type: :request do
  include_context 'rpdoc'

  before(:each) do |example|
    example.metadata[:rpdoc_action_key] = 'group list'
    example.metadata[:rpdoc_action_name] = '取得群組列表'
    example.metadata[:rpdoc_example_folders] = ['v1', 'groups']

    @member = mock_member(:member_me)
    @headers = { 'Authorization' => 'Bearer {{rabbit_token}}' }
    @group = mock_group(@member)
    @path = "/api/v1/groups"
    @params = {
      page: 1,
      per_page: 10
    }
  end

  context '#index' do

    it 'should return 200', rpdoc_example_key: 200, rpdoc_example_name: 'show group list success' do
      get @path, headers: @headers, params: @params
      expect(response).to have_http_status(200)
    end

  end

end
