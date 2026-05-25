require 'rails_helper'

RSpec.describe '/api/v1/groups/sign_tasks/decline_reasons#update', type: :request do
  include_context 'rpdoc'

  before(:each) do |example|
    example.metadata[:rpdoc_action_key] = 'update'
    example.metadata[:rpdoc_action_name] = '更新拒簽原因'
    example.metadata[:rpdoc_example_folders] = ['v1', 'groups', 'sign_tasks', 'decline_reasons']

    mock_decline_reasons
    @member = mock_member(:member_me)
    @headers = {'Authorization' => 'Bearer {{rabbit_token}}', 'Content-Type' => 'application/json'}
    @group = mock_group(@member)
    @group2 = Group.create(name: "Group 2")
    @decline_reason = DeclineReason.create(content: "create group decline reason")
    GroupDeclineReason.create(group: @group, decline_reason: @decline_reason)
    @params = { group_id: @group.id, decline_reason_id: @decline_reason.id, content: 'update group decline reason' }
    @path = '/api/v1/groups/sign_tasks/decline_reasons'
  end

  describe '#update' do
    it 'should return 200 if update decline reasons success', rpdoc_example_key: 200, rpdoc_example_name: '新增團隊拒簽原因成功' do
      GroupDeclineReason.create(group: @group2, decline_reason: @decline_reason)
      put @path, params: @params.to_json, headers: @headers
      expect(response).to have_http_status(200)
      expect(json['data']['content']).to eq(@params[:content])
      expect(json['data']['system_reserved']).to be(false)
      expect(@group2.decline_reasons.reload.first.content).to match("create group decline reason")
    end

    it 'should return 200 if update decline reasons success' do
      put @path, params: @params.to_json, headers: @headers
      expect(response).to have_http_status(200)
      expect(json['data']['content']).to eq(@params[:content])
      expect(json['data']['system_reserved']).to be(false)
      expect(DeclineReason.find_by_id(@decline_reason.id)).to be(nil)
    end

    it 'should return 404_205 if group is not found', rpdoc_example_key: 404_025, rpdoc_example_name: '新增團隊拒簽原因失敗 (404_205 group not found)' do
      @params[:group_id] = Group.last.id + 1

      put @path, params: @params.to_json, headers: @headers
      expect(response).to have_http_status(404)
      expect(json['error_code']).to eq(404_205)
      expect(json['error_key']).to eq('group_not_found')
    end

    it 'should return 403_056 if group_member has no permission to update decline reason', rpdoc_example_key: 403_056, rpdoc_example_name: '新增團隊拒簽原因失敗 (403_056 member has no permission)' do
      @member = mock_member(:member_a)
      @group = mock_group(@member, role: 'member')

      put @path, params: @params.to_json, headers: @headers
      expect(response).to have_http_status(403)
      expect(json['error_code']).to eq(403_056)
      expect(json['error_key']).to eq('group_not_accessible')
    end

    it 'should return 400_417 if decline reason content is too long', rpdoc_example_key: 400_417, rpdoc_example_name: '新增團隊拒簽原因失敗 (400_417 decline reason content too long)' do
      @params[:content] = 'content' * 100

      put @path, params: @params.to_json, headers: @headers
      expect(response).to have_http_status(400)
      expect(json['error_code']).to eq(400_417)
      expect(json['error_key']).to eq('invalid_params')
    end

    it 'should return 400_417 if system decline reason content duplicate', rpdoc_example_key: 400_417, rpdoc_example_name: '新增團隊拒簽原因失敗 (400_417 system decline reason content duplicate)' do
      @params[:content] = DeclineReason.first.content

      put @path, params: @params.to_json, headers: @headers
      expect(response).to have_http_status(400)
      expect(json['error_code']).to eq(400_417)
      expect(json['error_key']).to eq('invalid_params')
    end

    it 'should return 400_417 if group decline reason content duplicate', rpdoc_example_key: 400_417, rpdoc_example_name: '新增團隊拒簽原因失敗 (400_417 system decline reason content duplicate)' do
      decline_reason = DeclineReason.create(content: @params[:content])
      GroupDeclineReason.create(group: @group, decline_reason: decline_reason)

      put @path, params: @params.to_json, headers: @headers
      expect(response).to have_http_status(400)
      expect(json['error_code']).to eq(400_417)
      expect(json['error_key']).to eq('invalid_params')
    end
  end
end
