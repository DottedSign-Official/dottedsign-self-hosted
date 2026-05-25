require 'rails_helper'

RSpec.describe Api::V1::SignTasks::Admin::RolesController, type: :request do
  include_context 'rpdoc'

  before(:each) do |example|
    example.metadata[:rpdoc_action_key] = 'create'
    example.metadata[:rpdoc_action_name] = '新增群組身份'
    example.metadata[:rpdoc_example_folders] = ['v1', 'sign_tasks', 'admin', 'roles']

    @member = mock_member(:member_me)
    @headers = {
      'Authorization' => 'Bearer {{rabbit_token}}',
      'Content-Type' => 'application/json'
    }
    @group = mock_group(@member)
  end

  describe '#create' do
    before(:each) do
      @path = '/api/v1/sign_tasks/admin/roles'
      @params = {
        group_id: @group.id,
        name: 'role_A',
        permission: {
          manage_users: false,
          view_users: true,
          manage_permission: false,
          view_team_tasks: true,
          download_processing_task_self_sender: true,
          download_processing_task_group_sender: true,
          download_processing_task_self_signer: true,
          download_processing_task_group_signer: true,
          download_completed_task_self_sender: true,
          download_completed_task_group_sender: true,
          download_completed_task_self_signer: true,
          download_completed_task_group_signer: true,
          download_sign_and_send_self_task: true,
          download_sign_and_send_group_task: true,
          download_audit_trail_self_sender: true,
          download_audit_trail_group_sender: true,
          download_audit_trail_self_signer: true,
          download_audit_trail_group_signer: true,
          delete_processing_task_self_sender: true,
          delete_sign_and_send_self_task: true,
          manage_company_name: false,
          manage_company_logo: false,
          manage_email_display_name: false,
          manage_decline_options: true,
          share_template: true,
          bulk_send: true,
          allow_kiosk: false,
          report_access: true,
          manage_system_ca: false
        }
      }
    end

    it 'should return 200', rpdoc_example_key: 200, rpdoc_example_name: 'create role success' do
      post @path, params: @params.to_json, headers: @headers

      expect(response).to have_http_status(200)
      expect(json['data']['priority']).to eq(@group.roles.count)
    end

    it 'should create a group role', rpdoc_skip: true do
      expect { post @path, params: @params.to_json, headers: @headers }
        .to change { @group.roles.count }.by(1)
    end

    it 'should return 404_205 if group not found', rpdoc_example_key: 404_205, rpdoc_example_name: 'create role failed(group not found)' do
      @params[:group_id] = 123_456

      post @path, params: @param.to_json, headers: @headers

      expect(response).to have_http_status(404)
      expect(json['error_key']).to eq('group_not_found')
      expect(json['error_code']).to eq(404_205)
    end

    it 'should return 403_063 if member not group admin', rpdoc_example_key: 403_063, rpdoc_example_name: 'create role failed(not group admin)' do
      @member = mock_member(:member_a)
      mock_group(@member)

      post @path, params: @params.to_json, headers: @headers

      expect(response).to have_http_status(403)
      expect(json['error_key']).to eq('member_not_group_admin')
      expect(json['error_code']).to eq(403_063)
    end

    it 'should return 400_081 when name duplicated', rpdoc_example_key: 400_081, rpdoc_example_name: 'create role failed(duplicated name)' do
      @params[:name] = @group.roles.first.name

      post @path, params: @params.to_json, headers: @headers

      expect(response).to have_http_status(400)
      expect(json['error_key']).to eq('duplicate_role_name')
      expect(json['error_code']).to eq(400_081)
    end

    it 'should return 400_082 when permission is invalid', rpdoc_example_key: 400_082, rpdoc_example_name: 'create role failed(invalidpermission)' do
      @params[:permission][:manage_permission] = true

      post @path, params: @params.to_json, headers: @headers

      expect(response).to have_http_status(400)
      expect(json['error_key']).to eq('invalid_permission')
      expect(json['error_code']).to eq(400_082)
    end

    it 'should return 400_083 when permission interlocking', rpdoc_example_key: 400_083, rpdoc_example_name: 'create role failed(permission interlocking)' do
      @params[:permission][:view_users] = false

      post @path, params: @params.to_json, headers: @headers

      expect(response).to have_http_status(400)
      expect(json['error_key']).to eq('permission_interlocking')
      expect(json['error_code']).to eq(400_083)
    end
  end
end
