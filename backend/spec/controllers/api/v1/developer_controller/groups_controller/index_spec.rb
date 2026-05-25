require 'rails_helper'

RSpec.describe Api::V1::Developer::GroupsController, type: :request do
  include_context 'rpdoc'

  before(:each) do |example|
    example.metadata[:rpdoc_action_key] = 'developer_group_list'
    example.metadata[:rpdoc_action_name] = 'get group list'
    example.metadata[:rpdoc_example_folders] = ['v1', 'developer', 'groups']
    mock_developer
    @member = mock_member(:member_me)
    @headers = { 'Authorization' => 'Bearer {{rabbit_token}}' }
    @group = mock_group(@member)
    @path = "/api/v1/developer/groups"
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
