require 'rails_helper'

RSpec.describe Api::V1::Developer::GroupsController, type: :request do
  include_context 'rpdoc'

  before(:each) do |example|
    example.metadata[:rpdoc_action_key] = 'assign member to group'
    example.metadata[:rpdoc_action_name] = 'assign member to group'
    example.metadata[:rpdoc_example_folders] = ['v1', 'developer', 'groups']
    mock_developer
    @headers = { 'Authorization' => 'Bearer {{rabbit_token}}', 'Content-Type' => 'application/json' }
    @member_a = mock_member(:member_a)
    @member = mock_member(:member_me)
    @group = mock_group(@member)
    @path = "/api/v1/developer/groups/assign_member_to_group"
    @params = {
      assignee_email: @member_a.email,
      group_id: @group.id,
      role: 'member'
    }
  end

  context '#assign_member_to_group' do
    it 'should return 200', rpdoc_example_key: 200, rpdoc_example_name: 'assign member to group' do
      post @path, headers: @headers, params: @params.to_json
      expect(response).to have_http_status(200)
      expect(@group.members.count).to eq(2)
      expect(@member_a.roles[0].name).to eq('member')
    end

    it 'should return 400', rpdoc_example_key: 400, rpdoc_example_name: 'invalid params of role' do
      @params[:role] = 'invalid_params'

      post @path, headers: @headers, params: @params.to_json
      expect(response).to have_http_status(400)
      expect(json['error_code']).to eq(400_417)
      expect(json['error_key']).to eq('invalid_params')
    end

    it 'should return 400', rpdoc_example_key: 400, rpdoc_example_name: 'member already in group' do
      mock_group(@member_a, role: 'member')
      post @path, headers: @headers, params: @params.to_json
      expect(response).to have_http_status(400)
      expect(json['error_code']).to eq(400_1301)
      expect(json['error_key']).to eq('already_in_group')
    end
  end

end
