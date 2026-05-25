require 'rails_helper'

RSpec.describe '/api/v1/groups_controller#show', type: :request do
  include_context 'rpdoc'

  before(:each) do |example|
    example.metadata[:rpdoc_action_key] = 'show'
    example.metadata[:rpdoc_action_name] = '取得群組資訊'
    example.metadata[:rpdoc_example_folders] = ['v1', 'groups']

    mock_decline_reasons
    @member = mock_member(:member_me)
    @headers = {'Authorization' => 'Bearer {{rabbit_token}}'}
    @group = mock_group(@member)
    @path = "/api/v1/groups/#{@group.id}"
  end

  context '#show' do

    it 'should return 200', rpdoc_example_key: 200, rpdoc_example_name: 'show group success' do
      get @path, headers: @headers
      expect(response).to have_http_status(200)
    end

    it 'should return 400_207 if member not related to group', rpdoc_example_key: 400_207, rpdoc_example_name: 'show group failed (member not related to group)' do
      mock_member(:member_a)
      get @path, headers: @headers
      expect(response).to have_http_status(400)
      expect(json['error_code']).to eq(400_207)
    end

    it 'should return 403056 if member forbid to get group info', rpdoc_example_key: 403056, rpdoc_example_name: 'show group failed (member forbid to get group info)' do
      a = mock_member(:member_a)
      invite = @group.add_member(a)
      invite.accept!
      a.reload
      get @path, headers: @headers
      expect(response).to have_http_status(403)
      expect(json['error_code']).to eq(403056)
    end

    it 'should return 403056 if assign new role to member and to get group info', rpdoc_example_key: 403056, rpdoc_example_name: 'show group failed (member forbid to get group info)' do
      # create new role and modify magnage_company_name and manage_company_logo to true
      role = Role.new(group_id: @group.id, name: 'new_role')
      role.permission = Settings.default.permissions[:member].merge({ 'manage_company_name' => true, 'manage_company_logo' => true })
      role.priority = @group.roles.count + 1
      role.save!
      member = mock_member(:member_a)
      invite = @group.add_member(member)
      invite.accept!
      member.reload
      @group.assign_role(member, role.name)
      get @path, headers: @headers
      expect(response).to have_http_status(403)
      expect(json['error_code']).to eq(403056)
    end
 
  end

end
