require 'rails_helper'

RSpec.describe '/api/v1/groups_controller#update', type: :request do
  include_context 'rpdoc'

  before(:each) do |example|
    example.metadata[:rpdoc_action_key] = 'update'
    example.metadata[:rpdoc_action_name] = '更新群組資訊'
    example.metadata[:rpdoc_example_folders] = ['v1', 'groups']

    @member = mock_member(:member_me)
    @headers = {'Authorization' => 'Bearer {{rabbit_token}}', 'Content-Type' => 'application/json'}
    @group = mock_group(@member)
    @path = "/api/v1/groups/#{@group.id}"
  end

  context '#update' do

    before(:each) do
      @params = {
        name: 'New Group Name'
      }
    end

    it 'should return 200', rpdoc_example_key: 200, rpdoc_example_name: 'update group success' do
      put @path, params: @params.to_json, headers: @headers
      expect(response).to have_http_status(200)
      @group.reload
      expect(@group.name).to eq(@params[:name])
    end

    it 'should return 400_207 if member not related to group', rpdoc_example_key: 400_207, rpdoc_example_name: 'update group failed (member not related to group)' do
      mock_member(:member_a)
      put @path, params: @params.to_json, headers: @headers
      expect(response).to have_http_status(400)
      expect(json['error_code']).to eq(400_207)
    end

    it 'should return 403056 if member forbid to get group info', rpdoc_example_key: 403056, rpdoc_example_name: 'update group failed (member forbid to get group info)' do
      a = mock_member(:member_a)
      invite = @group.add_member(a)
      invite.accept!
      a.reload
      put @path, params: @params.to_json, headers: @headers
      expect(response).to have_http_status(403)
      expect(json['error_code']).to eq(403056)
    end
  end

end
