require 'rails_helper'

RSpec.describe '/api/v1/groups_controller#create', type: :request do
  include_context 'rpdoc'

  before(:each) do |example|
    example.metadata[:rpdoc_action_key] = 'create'
    example.metadata[:rpdoc_action_name] = '建立群組'
    example.metadata[:rpdoc_example_folders] = ['v1', 'groups']

    @member = mock_member(:member_me)
    @headers = {'Authorization' => 'Bearer {{rabbit_token}}', 'Content-Type' => 'application/json'}
    @path = '/api/v1/groups'
  end

  context '#create' do
    before(:each) do
      @params = {
        group_name: 'Test Group'
      }
    end

    it 'should return 200', rpdoc_example_key: 200, rpdoc_example_name: 'create group success' do
      post @path, params: @params.to_json, headers: @headers
      expect(response).to have_http_status(200)
    end

    it 'should create a new group', rpdoc_skip: true do
      expect{post @path, params: @params.to_json, headers: @headers}.to change{Group.count}.by(1)
    end

    it 'should return 400_1301', rpdoc_example_key: 400_1301, rpdoc_example_name: 'create group failed (already in group)' do
      mock_group(@member)
      post @path, params: @params.to_json, headers: @headers
      expect(response).to have_http_status(400)
      expect(json['error_code']).to eq(400_1301)
    end
  end

end
