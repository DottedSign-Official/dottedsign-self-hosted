require 'rails_helper'

RSpec.describe Api::V1::SignTasks::Admin::RolesController, type: :request do
  include_context 'rpdoc'

  before(:each) do |example|
    example.metadata[:rpdoc_action_key] = 'list'
    example.metadata[:rpdoc_action_name] = '取得群組身份列表'
    example.metadata[:rpdoc_example_folders] = ['v1', 'sign_tasks', 'admin', 'roles']

    @member = mock_member(:member_me)
    @headers = {
      'Authorization' => 'Bearer {{rabbit_token}}'
    }
    @group = mock_group(@member)
  end

  describe '#index' do
    before(:each) do
      @path = '/api/v1/sign_tasks/admin/roles'
      @params = {
        group_id: @group.id
      }
    end

    it 'should return 200', rpdoc_example_key: 200, rpdoc_example_name: 'get admin roles success' do
      get "#{@path}?#{URI.encode_www_form(@params)}", headers: @headers

      expect(response).to have_http_status(200)
      expect(json['data']['roles'].length).to eq(@group.roles.count)
      expect(json['data']['roles']).to be_an_instance_of(Array)
    end

    it 'should return 404_205 if group not found', rpdoc_example_key: 404_205, rpdoc_example_name: 'create role failed(group not found)' do
      @params[:group_id] = 123_456

      get "#{@path}?#{URI.encode_www_form(@params)}", headers: @headers

      expect(response).to have_http_status(404)
      expect(json['error_key']).to eq('group_not_found')
      expect(json['error_code']).to eq(404_205)
    end

  end
end
