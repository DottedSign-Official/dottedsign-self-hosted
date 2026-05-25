require 'rails_helper'

RSpec.describe '/api/v1/developer/sign_tasks/decline_reasons#index', type: :request do
  include_context 'rpdoc'

  before(:each) do |example|
    example.metadata[:rpdoc_action_key] = 'index'
    example.metadata[:rpdoc_action_name] = '取得所有拒簽原因'
    example.metadata[:rpdoc_example_folders] = ['v1', 'developer', 'sign_tasks', 'decline_reasons']

    mock_developer
    mock_decline_reasons
    mock_http_send
    @member = mock_member(:member_me, skip_auth: example.metadata[:skip_auth])
    @headers = { 'Authorization' => 'Bearer {{rabbit_token}}' }
    @path = '/api/v1/developer/sign_tasks/decline_reasons'
  end

  describe '#index' do
    it 'should return 200 if get reserved decline reasons success', rpdoc_example_key: 200, rpdoc_example_name: 'decline task success' do
      get @path, headers: @headers
      expect(response).to have_http_status(200)
      expect(json['data'].count).to be(5)
      expect(json['data'].first["system_reserved"]).to be(true)
    end
  end
end
