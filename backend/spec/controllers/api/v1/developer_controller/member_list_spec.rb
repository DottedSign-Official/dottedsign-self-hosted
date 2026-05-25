require 'rails_helper'

RSpec.describe Api::V1::Developer::MembersController, type: :request do
  include_context 'rpdoc'

  before(:each) do |example|
    example.metadata[:rpdoc_action_key] = 'member_list'
    example.metadata[:rpdoc_action_name] = 'member_list'
    example.metadata[:rpdoc_example_folders] = ['v1', 'developer', 'members']
    mock_developer
    @member = mock_member(:member_me)
    mock_group(@member)
    mock_member(:member_a)

    @headers = { 'Authorization' => 'Bearer {{rabbit_token}}' }
    @path = "/api/v1/developer/members"
    @params = {
      search_email: 'me@gmail.com',
      filter_status: 'active',
      search_group_name: 'Default Group',
      filter_none_group: false,
      page: 1,
      per_page: 10,
    }
  end

  context '#member_list' do
    it 'should return 200', rpdoc_example_key: 200, rpdoc_example_name: 'member_list' do
      get @path, params: @params, headers: @headers
      expect(response).to have_http_status(200)
    end
  end

end
