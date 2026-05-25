require 'rails_helper'

RSpec.describe Api::V1::SignTasks::AdminController, type: :request do
  include_context 'rpdoc'

  before(:each) do |example|
    example.metadata[:rpdoc_action_key] = 'change_permission'
    example.metadata[:rpdoc_action_name] = '修改群組權限'
    example.metadata[:rpdoc_example_folders] = ['v1', 'sign_tasks', 'admin']

    mock_http_send
    @member = mock_member(:member_me)
    @headers = {
      'Authorization' => 'Bearer {{rabbit_token}}',
      'Content-Type' => 'application/json'
    }
    @group = mock_group(@member)
  end

  describe '#tasks' do
    before(:each) do
      @path = '/api/v1/sign_tasks/admin/change_permission'
      @params = {
        group_id: @group.id,
        permissions: [{
          role: 'manager',
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
          manage_company_name: true,
          manage_company_logo: true,
          manage_email_display_name: true,
          manage_decline_reasons: false,
          share_template: true,
          share_combination: true,
          bulk_send: true,
          allow_kiosk: false,
          report_access: true,
          manage_system_ca: false
        }]
      }
    end

    it 'should return 200', rpdoc_example_key: 200, rpdoc_example_name: 'change admin permission success' do
      put @path, params: @params.to_json, headers: @headers

      expect(response).to have_http_status(200)
      expect(json['data'].length).to eq(Settings.default.permissions.keys.length)

      new_permission = @params[:permissions].first
      manager_permission = json['data'].find { |permission| permission['name'] == new_permission[:role] }

      manager_permission['permission'].each do |action, value|
        expect(new_permission[action.to_sym]).to eq(value)
      end
    end

    it 'should return 400207 if member not belongs to group', rpdoc_example_key: 400207, rpdoc_example_name: 'change admin permission failed (member not belongs to group)' do
      @member.group_invites.first.revoke!
      put @path, params: @params.to_json, headers: @headers
      expect(response).to have_http_status(400)
      expect(json['error_code']).to eq(400207)
    end

    it 'should return 403056 if group member forbid to manage permission', rpdoc_example_key: 403056, rpdoc_example_name: 'change admin permission failed (group member forbid to manage permission)' do
      a = FactoryBot.create(:member_a)
      invite = @group.add_member(a)
      invite.accept!
      mock_member(:member_a)
      put @path, params: @params.to_json, headers: @headers
      expect(response).to have_http_status(403)
      expect(json['error_code']).to eq(403056)
    end

    it 'should return 400_082 when permission is invalid', rpdoc_example_key: 400_082, rpdoc_example_name: 'change admin permission failed(invalidpermission)' do
      @params[:permissions].first[:manage_permission] = true

      put @path, params: @params.to_json, headers: @headers

      expect(response).to have_http_status(400)
      expect(json['error_key']).to eq('invalid_permission')
      expect(json['error_code']).to eq(400_082)
    end

    it 'should return 400_083 when permission interlocking', rpdoc_example_key: 400_083, rpdoc_example_name: 'change admin permission failed(permission interlocking)' do
      @params[:permissions].first[:view_users] = false

      put @path, params: @params.to_json, headers: @headers

      expect(response).to have_http_status(400)
      expect(json['error_key']).to eq('permission_interlocking')
      expect(json['error_code']).to eq(400_083)
    end
  end
end
