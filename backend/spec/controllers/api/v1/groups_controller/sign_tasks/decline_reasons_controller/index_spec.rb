require 'rails_helper'

RSpec.describe '/api/v1/groups/sign_tasks/decline_reasons#index', type: :request do
  include_context 'rpdoc'

  before(:each) do |example|
    example.metadata[:rpdoc_action_key] = 'index'
    example.metadata[:rpdoc_action_name] = '取得拒簽原因'
    example.metadata[:rpdoc_example_folders] = ['v1', 'groups', 'sign_tasks', 'decline_reasons']

    mock_decline_reasons
    decline_reason = DeclineReason.create(content: "group decline reason", system_reserved: false)
    @member = mock_member(:member_me)
    @headers = { 'Authorization' => 'Bearer {{rabbit_token}}' }
    @group = mock_group(@member)
    GroupDeclineReason.create(group: @group, decline_reason: decline_reason)
    @params = { group_id: @group.id }
    @path = '/api/v1/groups/sign_tasks/decline_reasons'
  end

  describe '#index' do
    it 'should return 200 if index decline reasons success', rpdoc_example_key: 200, rpdoc_example_name: '取得團隊拒簽原因成功' do
      get @path, params: @params, headers: @headers
      expect(response).to have_http_status(200)
      expect(json['data'].count).to eq(6)
    end

    it 'should return 404_205 if group is not found', rpdoc_example_key: 404_025, rpdoc_example_name: '取得團隊拒簽原因失敗 (404_205 group not found)' do
      @params[:group_id] = Group.last.id + 1

      get @path, params: @params, headers: @headers
      expect(response).to have_http_status(404)
      expect(json['error_code']).to eq(404_205)
      expect(json['error_key']).to eq('group_not_found')
    end
  end
end
