require 'rails_helper'

RSpec.describe Api::V1::Developer::GroupsController, type: :request do
  include_context 'rpdoc'

  before(:each) do |example|
    example.metadata[:rpdoc_action_key] = 'remove member from group'
    example.metadata[:rpdoc_action_name] = 'remove member from group'
    example.metadata[:rpdoc_example_folders] = ['v1', 'developer', 'groups']
    mock_developer
    @headers = { 'Authorization' => 'Bearer {{rabbit_token}}', 'Content-Type' => 'application/json' }
    @member = mock_member(:member_me)
    @group = mock_group(@member)
    @path = "/api/v1/developer/groups/remove_member_from_group"
    @params = {
      assignee_email: @member.email,
      group_id: @group.id,
    }
  end

  context '#remove member from group' do
    it 'should return 200', rpdoc_example_key: 200, rpdoc_example_name: 'remove member from group' do
      delete @path, headers: @headers, params: @params.to_json
      expect(response).to have_http_status(200)
    end
  end

end
