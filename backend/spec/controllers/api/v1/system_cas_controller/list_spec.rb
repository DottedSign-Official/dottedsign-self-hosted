require 'rails_helper'

RSpec.describe Api::V1::SystemCasController, type: :request do
  include_context 'rpdoc'

  before(:each) do |example|
    example.metadata[:rpdoc_action_key] = 'list'
    example.metadata[:rpdoc_action_name] = 'list system cas'
    example.metadata[:rpdoc_example_folders] = ['V1', 'system_cas']

    FactoryBot.create(:system_ca, group: @default_group, member: @default_admin)

    @headers = {
      'Authorization' => 'Bearer {{rabbit_token}}'
    }
    @path = '/api/v1/system_cas/list'
  end

  describe '#list', mock_default_group: true do

    it 'should return 200 and get system ca list', rpdoc_example_key: 200, rpdoc_example_name: 'list sysmem ca success' do
      get @path, headers: @headers
      expect(response).to have_http_status(200)
      expect(json['data'].length).to eq(1)
    end

    it 'should return 404 if group not found', rpdoc_example_key: 404_205, rpdoc_example_name: '404 group not found' do
      mock_member(:member_me)

      get @path, headers: @headers

      expect(response).to have_http_status(404)
      expect(json['error_code']).to eq(404205)
      expect(json['error_key']).to eq('group_not_found')
    end

    it 'should return 403 if is not admin', rpdoc_example_key: 403_056, rpdoc_example_name: '403 member not accessible' do
      member = mock_member(:member_me)
      mock_group(member, role: 'manager')

      get @path, headers: @headers

      expect(response).to have_http_status(403)
      expect(json['error_code']).to eq(403056)
      expect(json['error_key']).to eq('group_not_accessible')
    end

  end
end
