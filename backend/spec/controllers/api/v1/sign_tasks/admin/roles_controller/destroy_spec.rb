require 'rails_helper'

RSpec.describe Api::V1::SignTasks::Admin::RolesController, type: :request do
  include_context 'rpdoc'

  before(:each) do |example|
    example.metadata[:rpdoc_action_key] = 'destroy'
    example.metadata[:rpdoc_action_name] = '移除群組身份'
    example.metadata[:rpdoc_example_folders] = ['v1', 'sign_tasks', 'admin', 'roles']

    @member = mock_member(:member_me)
    @headers = {
      'Authorization' => 'Bearer {{rabbit_token}}',
      'Content-Type' => 'application/json'
    }
    @group = mock_group(@member)
    @role = create(:role, group: @group)
  end

  describe '#destroy' do
    before(:each) do
      @path = '/api/v1/sign_tasks/admin/roles'
      @params = {
        group_id: @group.id,
        role_id: @role.id
      }
    end

    it 'should return 200', rpdoc_example_key: 200, rpdoc_example_name: 'delete role success' do
      delete @path, params: @params.to_json, headers: @headers

      expect(response).to have_http_status(200)
    end

    it 'should create a group role', rpdoc_skip: true do
      expect { delete @path, params: @params.to_json, headers: @headers }
        .to change { @group.roles.count }.by(-1)
    end

    it 'should return 404_205 if group not found', rpdoc_example_key: 404_205, rpdoc_example_name: 'delete role failed(group not found)' do
      @params[:group_id] = 123_456

      delete @path, params: @params.to_json, headers: @headers

      expect(response).to have_http_status(404)
      expect(json['error_key']).to eq('group_not_found')
      expect(json['error_code']).to eq(404_205)
    end

    it 'should return 403_063 if member not group admin', rpdoc_example_key: 403_063, rpdoc_example_name: 'delete role failed(not group admin)' do
      @member = mock_member(:member_a)
      mock_group(@member)

      delete @path, params: @params.to_json, headers: @headers

      expect(response).to have_http_status(403)
      expect(json['error_key']).to eq('member_not_group_admin')
      expect(json['error_code']).to eq(403_063)
    end

    it 'should return 404_044 when role not found', rpdoc_example_key: 404_044, rpdoc_example_name: 'delete role failed(role not found)' do
      @params[:role_id] = 123_456

      delete @path, params: @params.to_json, headers: @headers

      expect(response).to have_http_status(404)
      expect(json['error_key']).to eq('role_not_found')
      expect(json['error_code']).to eq(404_044)
    end

    it 'should return 403_061 when role is assigned', rpdoc_example_key: 403_061, rpdoc_example_name: 'delete role failed(role is assigned)' do
      @member_a = create(:member_a)
      mock_group(@member_a, role: @role.name)

      delete @path, params: @params.to_json, headers: @headers

      expect(response).to have_http_status(403)
      expect(json['error_key']).to eq('role_is_assigned')
      expect(json['error_code']).to eq(403_061)
    end

    it 'should return 403_062 when role is reserved', rpdoc_example_key: 403_062, rpdoc_example_name: 'delete role failed(role is reserved)' do
      @params[:role_id] = @group.roles.first.id

      delete @path, params: @params.to_json, headers: @headers

      expect(response).to have_http_status(403)
      expect(json['error_key']).to eq('role_not_allow_to_delete')
      expect(json['error_code']).to eq(403_062)
    end
  end
end
