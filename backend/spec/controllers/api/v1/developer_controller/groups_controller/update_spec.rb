require 'rails_helper'

RSpec.describe Api::V1::Developer::GroupsController, type: :request do
  include_context 'rpdoc'

  before(:each) do |example|
    example.metadata[:rpdoc_action_key] = 'update_group'
    example.metadata[:rpdoc_action_name] = 'update group'
    example.metadata[:rpdoc_example_folders] = ['v1', 'developer', 'groups']
    mock_developer
    @member = mock_member(:member_me)
    @headers = { 'Authorization' => 'Bearer {{rabbit_token}}', 'Content-Type' => 'application/json' }
    @group = mock_group(@member)
    @path = "/api/v1/developer/groups"
    @params = {
      group_id: @group.id,
      group_name: 'rename_group'
    }
  end

  context '#update' do
    it 'should return 200', rpdoc_example_key: 200, rpdoc_example_name: 'update group' do
      put @path, headers: @headers, params: @params.to_json
      @group.reload
      expect(response).to have_http_status(200)
      expect(@group.name).to eq('rename_group')
    end

  end

end
