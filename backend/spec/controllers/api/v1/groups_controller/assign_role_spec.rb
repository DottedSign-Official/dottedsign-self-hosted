require 'rails_helper'

RSpec.describe '/api/v1/groups_controller#assign_role', type: :request do
  include_context 'rpdoc'

  before(:each) do |example|
    example.metadata[:rpdoc_action_key] = 'assign_role'
    example.metadata[:rpdoc_action_name] = '指定群組角色'
    example.metadata[:rpdoc_example_folders] = ['v1', 'groups']

    @member = mock_member(:member_me)
    @headers = {'Authorization' => 'Bearer {{rabbit_token}}', 'Content-Type' => 'application/json'}
    @group = mock_group(@member)
    @invitee = FactoryBot.create(:member_a)
    @invite = @group.add_member(@invitee)
    @invite.accept!
    @invitee.reload
    @path = "/api/v1/groups/assign_role"
  end

  context '#assign_role' do

    before(:each) do
      @params = {
        group_id: @group.id,
        email: @invitee.email,
        roles: ['manager']
      }
    end

    it 'should return 200', rpdoc_example_key: 200, rpdoc_example_name: 'assign member role success' do
      put @path, params: @params.to_json, headers: @headers
      expect(response).to have_http_status(200)
      @invitee.reload
      expect(@invitee.current_roles.pluck(:name)).to eq(@params[:roles])
    end

    it 'should return 400_207 if member not related to group', rpdoc_example_key: 400_207, rpdoc_example_name: 'assign member role failed (member not related to group)' do
      mock_member(:member_b)
      put @path, params: @params.to_json, headers: @headers
      expect(response).to have_http_status(400)
      expect(json['error_code']).to eq(400_207)
    end

    it 'should return 403_056 if member forbid to get group info', rpdoc_example_key: 403_056, rpdoc_example_name: 'assign member role failed (member forbid to get group info)' do
      b = mock_member(:member_b)
      invite = @group.add_member(b)
      invite.accept!
      b.reload
      put @path, params: @params.to_json, headers: @headers
      expect(response).to have_http_status(403)
      expect(json['error_code']).to eq(403_056)
    end

    it 'should return 400_207 if member not in group', rpdoc_example_key: 400_207, rpdoc_example_name: 'assign member role failed (member not in group)' do
      @invite.revoke!
      put @path, params: @params.to_json, headers: @headers
      expect(response).to have_http_status(400)
      expect(json['error_code']).to eq(400_207)
    end

    it 'should return 400_1309 if there will be no admin after change role', rpdoc_example_key: 400_1309, rpdoc_example_name: 'assign member role failed (there will be no admin after change role)' do
      @params[:email] = @member.email
      put @path, params: @params.to_json, headers: @headers
      expect(response).to have_http_status(400)
      expect(json['error_code']).to eq(400_1309)
    end

    it 'should return 403_1302 if other want to change admin role', rpdoc_example_key: 403_1302, rpdoc_example_name: 'assign member role failed (other want to change admin role)' do
      @group.assign_role(@invitee, ['admin'])
      put @path, params: @params.to_json, headers: @headers
      expect(response).to have_http_status(403)
      expect(json['error_code']).to eq(403_1302)
    end

  end

end
