require 'rails_helper'

RSpec.describe Api::V1::Developer::GroupsController, type: :request do
  include_context 'rpdoc'

  before(:each) do |example|
    example.metadata[:rpdoc_action_key] = 'create_group'
    example.metadata[:rpdoc_action_name] = 'create group'
    example.metadata[:rpdoc_example_folders] = ['v1', 'developer', 'groups']
    mock_developer
    @member = mock_member(:member_me)
    @headers = { 'Authorization' => 'Bearer {{rabbit_token}}', 'Content-Type' => 'application/json' }
    @path = "/api/v1/developer/groups"
    @params = {
      group_name: 'test_group'
    }
  end

  context '#create' do
    it 'should return 200', rpdoc_example_key: 200, rpdoc_example_name: 'create group' do
      post @path, headers: @headers, params: @params.to_json
      expect(response).to have_http_status(200)
    end
  end

end
