require 'rails_helper'

RSpec.describe '/api/v1/groups/sign_tasks/decline_reasons#destroy', type: :request do
  include_context 'rpdoc'

  before(:each) do |example|
    example.metadata[:rpdoc_action_key] = 'destroy'
    example.metadata[:rpdoc_action_name] = '刪除拒簽原因'
    example.metadata[:rpdoc_example_folders] = ['v1', 'groups', 'sign_tasks', 'decline_reasons']

    mock_decline_reasons
    @member = mock_member(:member_me)
    @headers = {'Authorization' => 'Bearer {{rabbit_token}}', 'Content-Type' => 'application/json'}
    @group = mock_group(@member)
    @decline_reason = DeclineReason.create(content: "create group decline reason")
    GroupDeclineReason.create(group: @group, decline_reason: @decline_reason)
    @params = { group_id: @group.id, decline_reason_id: @decline_reason.id }
    @path = '/api/v1/groups/sign_tasks/decline_reasons'
  end

  describe '#destroy' do
    it 'should return 200 if delete decline reason success', rpdoc_example_key: 200, rpdoc_example_name: '刪除團隊拒簽原因成功' do
      delete @path, params: @params.to_json, headers: @headers
      expect(response).to have_http_status(200)
      expect(@group.decline_reasons.count).to eq(0)
    end

    it 'should return 403_056 if group_member has no permission to create decline reason', rpdoc_example_key: 403_056, rpdoc_example_name: '刪除團隊拒簽原因失敗 (403_056 member has no permission)' do
      @member = mock_member(:member_a)
      @group = mock_group(@member, role: 'member')

      delete(@path, params: @params.to_json, headers: @headers)
      expect(response).to have_http_status(403)
      expect(json['error_code']).to eq(403_056)
      expect(json['error_key']).to eq('group_not_accessible')
    end

    it 'should return 404_042 if decline reason is not found', rpdoc_example_key: 404_025, rpdoc_example_name: '刪除團隊拒簽原因失敗 ( 404_042 decline reason not found)' do
      @params[:decline_reason_id] = DeclineReason.last.id + 1

      delete(@path, params: @params.to_json, headers: @headers)
      expect(response).to have_http_status(404)
      expect(json['error_code']).to eq(404_042)
      expect(json['error_key']).to eq('decline_reason_not_found')
    end

    it 'should return 404_205 if group is not found', rpdoc_example_key: 404_025, rpdoc_example_name: '刪除團隊拒簽原因失敗 (404_205 group not found)' do
      @params[:group_id] = Group.last.id + 1

      delete(@path, params: @params.to_json, headers: @headers)
      expect(response).to have_http_status(404)
      expect(json['error_code']).to eq(404_205)
      expect(json['error_key']).to eq('group_not_found')
    end
  end
end
