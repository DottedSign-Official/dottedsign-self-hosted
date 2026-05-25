require 'rails_helper'

RSpec.describe Api::V1::SystemCasController, type: :request do
  include_context 'rpdoc'

  before(:each) do |example|
    example.metadata[:rpdoc_action_key] = 'destroy'
    example.metadata[:rpdoc_action_name] = 'destroy system ca'
    example.metadata[:rpdoc_example_folders] = ['V1', 'system_cas']

    @system_ca = FactoryBot.create(:system_ca, group: @default_group)

    @headers = {
      'Authorization' => 'Bearer {{rabbit_token}}',
      'Content-Type' => 'application/json'
    }
    @path = '/api/v1/system_cas'

    @params = {
      id: @system_ca.id
    }
  end

  describe '#destroy', mock_default_group: true do

    it 'should return 200', rpdoc_example_key: 200, rpdoc_example_name: 'destroy sysmem ca success' do
      delete @path, params: @params.to_json, headers: @headers

      expect(response).to have_http_status(200)
      expect(SystemCa.exists?(@system_ca.id)).to be(false)
    end

    it 'should return 404 if group not found', rpdoc_example_key: 404_205, rpdoc_example_name: '404 group not found' do
      mock_member(:member_me)

      post @path, params: @params.to_json, headers: @headers

      expect(response).to have_http_status(404)
      expect(json['error_code']).to eq(404205)
      expect(json['error_key']).to eq('group_not_found')
    end

    it 'should return 403 if is not admin', rpdoc_example_key: 403_056, rpdoc_example_name: '403 member not accessible' do
      member = mock_member(:member_me)
      mock_group(member, role: 'manager')

      post @path, params: @params.to_json, headers: @headers

      expect(response).to have_http_status(403)
      expect(json['error_code']).to eq(403056)
      expect(json['error_key']).to eq('group_not_accessible')
    end

  end
end
