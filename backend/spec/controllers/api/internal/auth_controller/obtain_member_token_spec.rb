require 'rails_helper'

RSpec.describe Api::Internal::AuthController, type: :request do
  include_context 'rpdoc'

  before(:each) do |example|
    example.metadata[:rpdoc_action_key] = 'obtain_member_token'
    example.metadata[:rpdoc_action_name] = 'obtain member token'
    example.metadata[:rpdoc_example_folders] = ['internal', 'auth']
    client = mock_client
    @member = mock_member(:member_me)
    @path = '/api/internal/auth/member_token'

    @params = {
      client_id: client.uid,
      client_secret: client.secret,
      email: @member.email
    }
  end

  describe '#get member access token' do
    it 'should return 200', rpdoc_example_key: 200, rpdoc_example_name: 'get member access token' do
      get @path , params: @params
      expect(response).to have_http_status(200)
    end
  end
end
