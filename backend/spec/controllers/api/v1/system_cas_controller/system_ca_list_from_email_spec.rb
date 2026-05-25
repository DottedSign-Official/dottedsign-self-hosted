require 'rails_helper'

RSpec.describe Api::V1::SystemCasController, type: :request do
  include_context 'rpdoc'

  before(:each) do |example|
    example.metadata[:rpdoc_action_key] = 'system_ca_list_from_email'
    example.metadata[:rpdoc_action_name] = 'system ca list from email'
    example.metadata[:rpdoc_example_folders] = ['V1', 'system_cas']

    @member = mock_member(:member_me)
    @system_ca = FactoryBot.create(:system_ca, group: @default_group, member: @member)

    @headers = {
      'Authorization' => 'Bearer {{rabbit_token}}'
    }
    @path = '/api/v1/system_cas/system_ca_list_from_email'

    @params = {
      email: @member.email
    }
  end

  describe '#system_ca_list_from_email', mock_default_group: true do

    it 'should return 200 and true if member has system ca access right', rpdoc_example_key: 200, rpdoc_example_name: 'system ca list from email' do
      get @path, params: @params, headers: @headers
      expect(response).to have_http_status(200)
    end

  end
end
