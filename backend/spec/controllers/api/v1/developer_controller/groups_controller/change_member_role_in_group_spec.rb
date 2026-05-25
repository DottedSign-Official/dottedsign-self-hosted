require 'rails_helper'

RSpec.describe Api::V1::Developer::GroupsController, type: :request do
  include_context 'rpdoc'

  before(:each) do |example|
    example.metadata[:rpdoc_action_key] = 'change role in group'
    example.metadata[:rpdoc_action_name] = 'change role in group'
    example.metadata[:rpdoc_example_folders] = ['v1', 'developer', 'groups']
    mock_developer
    @headers = { 'Authorization' => 'Bearer {{rabbit_token}}', 'Content-Type' => 'application/json' }
    @member = mock_member(:member_me)
    @group = mock_group(@member)
    @path = "/api/v1/developer/groups/change_member_role_in_group"
    @params = {
      assignee_email: @member.email,
      roles: ['member', 'admin'],
    }
  end

  context '#change member role in group' do
    it 'should return 200', rpdoc_example_key: 200, rpdoc_example_name: 'change member role in group' do
      put @path, headers: @headers, params: @params.to_json
      expect(response).to have_http_status(200)
      expect(Member.last.roles.pluck(:name).sort).to eq(@params[:roles].sort)
    end
  end

end
