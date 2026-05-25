require 'rails_helper'

RSpec.describe '/api/v1/developer/sign_tasks/decline_reasons#destroy', type: :request do
  include_context 'rpdoc'

  before(:each) do |example|
    example.metadata[:rpdoc_action_key] = 'destroy'
    example.metadata[:rpdoc_action_name] = '刪除拒簽原因'
    example.metadata[:rpdoc_example_folders] = ['v1', 'developer', 'sign_tasks', 'decline_reasons']

    mock_developer
    mock_decline_reasons
    mock_http_send
    @member = mock_member(:member_me, skip_auth: example.metadata[:skip_auth])
    @member_a = mock_member(:member_a)
    @group = mock_group(@member_a)
    @decline_reason = DeclineReason.active_system_reserved.last
    @headers = {
      'Authorization' => 'Bearer {{rabbit_token}}',
      'Content-Type' => 'application/json'
    }
    @params = { decline_reason_id: @decline_reason.id }
    @path = '/api/v1/developer/sign_tasks/decline_reasons'
  end

  describe '#destroy' do
    it 'should return 200 if decline reason destroy success', rpdoc_example_key: 200, rpdoc_example_name: 'destroy decline reason success' do
      delete @path, params: @params.to_json, headers: @headers
      expect(response).to have_http_status(200)
      expect(@decline_reason.reload.status).to eq("deleted")
      expect(@group.active_system_and_group_decline_reasons.count).to eq(4)
    end

    it 'should return 403_1301 if only for super admin', rpdoc_example_key: 403_1301, rpdoc_example_name: '建立拒簽原因失敗 (403_1301 only_for_developer)' do
      allow_any_instance_of(Member).to receive(:super_admin?).and_return(false)

      delete @path, params: @params.to_json, headers: @headers
      expect(response).to have_http_status(403)
      expect(json['error_code']).to eq(403_1301)
      expect(json['error_key']).to eq('only_for_developer')
    end

    it 'should return 404_042 if decline reason is not found', rpdoc_example_key: 404_025, rpdoc_example_name: '更新團隊拒簽原因失敗 ( 404_042 decline reason not found)' do
      @params[:decline_reason_id] = DeclineReason.last.id + 1

      delete @path, params: @params.to_json, headers: @headers
      expect(response).to have_http_status(404)
      expect(json['error_code']).to eq(404_042)
      expect(json['error_key']).to eq('decline_reason_not_found')
    end
  end
end
