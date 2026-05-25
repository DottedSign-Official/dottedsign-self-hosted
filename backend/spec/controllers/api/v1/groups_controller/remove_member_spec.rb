require 'rails_helper'

RSpec.describe '/api/v1/groups_controller#remove_member', type: :request do
  include_context 'rpdoc'

  before(:each) do |example|
    example.metadata[:rpdoc_action_key] = 'remove_member'
    example.metadata[:rpdoc_action_name] = '群組移除用戶'
    example.metadata[:rpdoc_example_folders] = ['v1', 'groups']

    @member = mock_member(:member_me)
    @headers = {'Authorization' => 'Bearer {{rabbit_token}}', 'Content-Type' => 'application/json'}
    @group = mock_group(@member)
    @invitee = FactoryBot.create(:member_a)
    @invite = @group.add_member(@invitee)
    @path = "/api/v1/groups/remove_member"
  end

  context '#remove_member' do

    before(:each) do
      @params = {
        group_id: @group.id,
        email: @invitee.email
      }
    end

    it 'should return 200 (remove waiting member)', rpdoc_example_key: 200_1, rpdoc_example_name: 'remove member from group success (remove waiting member)' do
      delete @path, params: @params.to_json, headers: @headers
      expect(response).to have_http_status(200)
      @invite.reload
      expect(@invite.status).to eq('canceled')
    end

    it 'should return 200 (remove accepted member)', rpdoc_example_key: 200_2, rpdoc_example_name: 'remove member from group success (remove accepted member)' do
      @invite.accept!
      delete @path, params: @params.to_json, headers: @headers
      expect(response).to have_http_status(200)
      @invite.reload
      expect(@invite.status).to eq('removed')
    end

    it 'should return 200 (remove self)', rpdoc_example_key: 200_3, rpdoc_example_name: 'remove member from group success (remove self)' do
      @invite.accept!
      delete @path, params: @params.to_json, headers: @headers
      expect(response).to have_http_status(200)
      @invite.reload
      expect(@invite.status).to eq('removed')
    end

    it 'should return 400_207 if member not related to group', rpdoc_example_key: 400_207, rpdoc_example_name: 'remove member from group failed (member not related to group)' do
      mock_member(:member_a)
      delete @path, params: @params.to_json, headers: @headers
      expect(response).to have_http_status(400)
      expect(json['error_code']).to eq(400_207)
    end

    it 'should return 403_056 if member forbid to get group info', rpdoc_example_key: 403_056, rpdoc_example_name: 'remove member from group failed (member forbid to get group info)' do
      @invite.accept!
      mock_member(:member_a)
      @params[:email] = @member.email
      delete @path, params: @params.to_json, headers: @headers
      expect(response).to have_http_status(403)
      expect(json['error_code']).to eq(403_056)
    end

    it 'should return 400_1303 if member has not been invited to group', rpdoc_example_key: 400_1303, rpdoc_example_name: 'remove member from group failed (member has not been invited to group)' do
      @invite.destroy
      delete @path, params: @params.to_json, headers: @headers
      expect(response).to have_http_status(400)
      expect(json['error_code']).to eq(400_1303)
    end

    it 'should return 403_1302 if other want to remove admin', rpdoc_example_key: 403_1302, rpdoc_example_name: 'assign member role failed (other want to remove admin)' do
      @invite.accept!
      @invitee.reload
      @group.assign_role(@invitee, ['admin'])
      delete @path, params: @params.to_json, headers: @headers
      expect(response).to have_http_status(403)
      expect(json['error_code']).to eq(403_1302)
    end
  end

end
