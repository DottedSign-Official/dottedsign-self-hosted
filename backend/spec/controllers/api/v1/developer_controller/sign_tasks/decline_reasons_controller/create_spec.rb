require 'rails_helper'

RSpec.describe '/api/v1/developer/sign_tasks/decline_reasons#create', type: :request do
  include_context 'rpdoc'

  before(:each) do |example|
    example.metadata[:rpdoc_action_key] = 'create'
    example.metadata[:rpdoc_action_name] = '建立拒簽原因'
    example.metadata[:rpdoc_example_folders] = ['v1', 'developer', 'sign_tasks', 'decline_reasons']

    mock_developer
    mock_http_send
    mock_decline_reasons
    @member = mock_member(:member_me, skip_auth: example.metadata[:skip_auth])
    @group = mock_group(@member)
    @headers = {
      'Authorization' => 'Bearer {{rabbit_token}}',
      'Content-Type' => 'application/json'
    }
    @params = { content: "create system reserved decline reason" }
    @path = '/api/v1/developer/sign_tasks/decline_reasons'
  end

  describe '#create' do
    it 'should return 200 if create system reserved decline reason and sync group success', rpdoc_example_key: 200, rpdoc_example_name: 'create decline reason success' do
      post @path, params: @params.to_json, headers: @headers
      expect(response).to have_http_status(200)
      expect(json['data']['system_reserved']).to be(true)
      expect(json['data']['content']).to eq(@params[:content])
      expect(@group.active_system_and_group_decline_reasons.count).to eq(6)
    end

    it 'should return 400_417 if decline reason content is too long', rpdoc_example_key: 400_417, rpdoc_example_name: '建立拒簽原因失敗 (400_417 decline reason content too long)' do
      @params[:content] = 'content' * 100

      post(@path, params: @params.to_json, headers: @headers)
      expect(response).to have_http_status(400)
      expect(json['error_code']).to eq(400_417)
      expect(json['error_key']).to eq('invalid_params')
    end

    it 'should return 400_417 if system reserved decline reason content is already exist ', rpdoc_example_key: 400_417, rpdoc_example_name: '建立拒簽原因失敗 (400_417 system reserved decline reason already exist)' do
      @params[:content] = DeclineReason.first.content

      post(@path, params: @params.to_json, headers: @headers)
      expect(response).to have_http_status(400)
      expect(json['error_code']).to eq(400_417)
      expect(json['error_key']).to eq('invalid_params')
    end

    it 'should return 400_417 if decline reason content is already exist ', rpdoc_example_key: 400_417, rpdoc_example_name: '建立拒簽原因失敗 (400_417 system reserved already exist)' do
      decline_reason = DeclineReason.create(system_reserved: true, content: "create new system reason")
      @params[:content] = decline_reason.content

      post(@path, params: @params.to_json, headers: @headers)
      expect(response).to have_http_status(400)
      expect(json['error_code']).to eq(400_417)
      expect(json['error_key']).to eq('invalid_params')
    end

    it 'should return 403_1301 if only for super admin', rpdoc_example_key: 403_1301, rpdoc_example_name: '建立拒簽原因失敗 (403_1301 only_for_developer)' do
      allow_any_instance_of(Member).to receive(:super_admin?).and_return(false)

      post(@path, params: @params.to_json, headers: @headers)
      expect(response).to have_http_status(403)
      expect(json['error_code']).to eq(403_1301)
      expect(json['error_key']).to eq('only_for_developer')
    end
  end
end
