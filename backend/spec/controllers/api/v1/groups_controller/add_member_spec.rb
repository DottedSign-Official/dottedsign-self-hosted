require 'rails_helper'

RSpec.describe '/api/v1/groups_controller#add_member', type: :request do
  include_context 'rpdoc'

  before(:each) do |example|
    example.metadata[:rpdoc_action_key] = 'add_member'
    example.metadata[:rpdoc_action_name] = '群組邀請用戶'
    example.metadata[:rpdoc_example_folders] = ['v1', 'groups']

    @member = mock_member(:member_me)
    @headers = {'Authorization' => 'Bearer {{rabbit_token}}', 'Content-Type' => 'application/json'}
    @group = mock_group(@member)
    @path = "/api/v1/groups/add_member"
  end

  context '#add_member', skip_auth: true do

    before(:each) do
      @params = {
        group_id: @group.id,
        email: 'invitee@test.com'
      }
    end

    it 'should return 200', rpdoc_example_key: 200, rpdoc_example_name: 'add member to group success' do
      post @path, params: @params.to_json, headers: @headers
      expect(response).to have_http_status(200)
    end

    it 'should return 200 if reinvite waited member', rpdoc_example_key: 200, rpdoc_example_name: 'reinvite waited member to group success' do
      post @path, params: @params.to_json, headers: @headers
      post @path, params: @params.to_json, headers: @headers
      expect(response).to have_http_status(200)
    end

    it 'should add a group invite', rpdoc_skip: true do
      expect{post @path, params: @params.to_json, headers: @headers}.to change{@group.group_invites.count}.by(1)
    end

    it 'should return 400_207 if member not related to group', rpdoc_example_key: 400_207, rpdoc_example_name: 'add member to group failed (member not related to group)' do
      mock_member(:member_a)
      post @path, params: @params.to_json, headers: @headers
      expect(response).to have_http_status(400)
      expect(json['error_code']).to eq(400_207)
    end

    it 'should return 403_056 if member forbid to get group info', rpdoc_example_key: 403_056, rpdoc_example_name: 'add member to group failed (member forbid to get group info)' do
      a = mock_member(:member_a)
      invite = @group.add_member(a)
      invite.accept!
      a.reload
      post @path, params: @params.to_json, headers: @headers
      expect(response).to have_http_status(403)
      expect(json['error_code']).to eq(403_056)
    end

    it 'should return 400_1301 if member already in group', rpdoc_example_key: 400_1301, rpdoc_example_name: 'add member to group failed (member already in group)' do
      a = FactoryBot.create(:member_a)
      invite = @group.add_member(a)
      invite.accept!
      @params[:email] = a.email
      post @path, params: @params.to_json, headers: @headers
      expect(response).to have_http_status(400)
      expect(json['error_code']).to eq(400_1301)
    end

    it 'should return 400_1302 if member already in other group', rpdoc_example_key: 400_1302, rpdoc_example_name: 'add member to group failed (member already in other group)' do
      a = FactoryBot.create(:member_a)
      a.generate_group
      @params[:email] = a.email
      post @path, params: @params.to_json, headers: @headers
      expect(response).to have_http_status(400)
      expect(json['error_code']).to eq(400_1302)
    end

  end

end
