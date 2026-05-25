require 'rails_helper'

RSpec.describe Api::V1::SignTasks::Admin::RolesController, type: :request do
  include_context 'rpdoc'

  before(:each) do |example|
    example.metadata[:rpdoc_action_key] = 'change_priorities'
    example.metadata[:rpdoc_action_name] = '更新身份優先級'
    example.metadata[:rpdoc_example_folders] = ['v1', 'sign_tasks', 'admin', 'roles']

    @member = mock_member(:member_me)
    @headers = {
      'Authorization' => 'Bearer {{rabbit_token}}',
      'Content-Type' => 'application/json'
    }
    @group = mock_group(@member)
    create(:role, group: @group)
    @role_admin, @other_roles = @group.roles.partition(&:admin?)
    @shuffle_roles = @role_admin + @other_roles
  end

  describe '#change_priorities' do
    before(:each) do
      @path = '/api/v1/sign_tasks/admin/roles/priorities'
      @params = {
        group_id: @group.id,
        role_ids: @shuffle_roles.pluck(:id)
      }
    end

    it 'should return 200', rpdoc_example_key: 200, rpdoc_example_name: 'change priorities success' do
      put @path, params: @params.to_json, headers: @headers

      expect(response).to have_http_status(200)
      @group.roles.each_with_index do |role, index|
        expect(role.id).to eq(@shuffle_roles[index].id)
      end
    end

    it 'should return 404_205 if group not found', rpdoc_example_key: 404_205, rpdoc_example_name: 'change priorities failed(group not found)' do
      @params[:group_id] = 123_456

      put @path, params: @params.to_json, headers: @headers

      expect(response).to have_http_status(404)
      expect(json['error_key']).to eq('group_not_found')
      expect(json['error_code']).to eq(404_205)
    end

    it 'should return 403_063 if member not group admin', rpdoc_example_key: 403_063, rpdoc_example_name: 'change priorities failed(not group admin)' do
      @member = mock_member(:member_a)
      mock_group(@member)

      put @path, params: @params.to_json, headers: @headers

      expect(response).to have_http_status(403)
      expect(json['error_key']).to eq('member_not_group_admin')
      expect(json['error_code']).to eq(403_063)
    end
  end
end
