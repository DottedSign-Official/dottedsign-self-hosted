require 'rails_helper'

RSpec.describe Api::V1::SignTasks::AdminController, type: :request do
  include_context 'rpdoc'

  before(:each) do |example|
    example.metadata[:rpdoc_action_key] = 'permission'
    example.metadata[:rpdoc_action_name] = '取得群組權限列表'
    example.metadata[:rpdoc_example_folders] = ['v1', 'sign_tasks', 'admin']

    mock_http_send
    @member = mock_member(:member_me)
    @headers = {
      'Authorization' => 'Bearer {{rabbit_token}}'
    }
    @group = mock_group(@member)
  end

  describe '#tasks' do
    before(:each) do
      @path = '/api/v1/sign_tasks/admin/permission'
      @params = {
        group_id: @group.id
      }
    end

    it 'should return 200', rpdoc_example_key: 200, rpdoc_example_name: 'get admin permission success' do
      get "#{@path}?#{URI.encode_www_form(@params)}", headers: @headers
      expect(response).to have_http_status(200)
      expect(json['data'].length).to eq(Settings.default.permissions.keys.length)
    end

    it 'should return 400207 if member not belongs to group', rpdoc_example_key: 400207, rpdoc_example_name: 'get admin permission failed (member not belongs to group)' do
      @member.group_invites.first.revoke!
      get "#{@path}?#{URI.encode_www_form(@params)}", headers: @headers
      expect(response).to have_http_status(400)
      expect(json['error_code']).to eq(400207)
    end

    it 'should return 403056 if group member forbid to manage permission', rpdoc_example_key: 403056, rpdoc_example_name: 'get admin permission failed (group member forbid to manage permission)' do
      a = FactoryBot.create(:member_a)
      invite = @group.add_member(a)
      invite.accept!
      mock_member(:member_a)
      get "#{@path}?#{URI.encode_www_form(@params)}", headers: @headers
      expect(response).to have_http_status(403)
      expect(json['error_code']).to eq(403056)
    end
  end

end
