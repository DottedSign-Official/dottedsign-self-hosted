require 'rails_helper'

RSpec.describe Api::V1::SystemCasController, type: :request do
  include_context 'rpdoc'

  before(:each) do |example|
    example.metadata[:rpdoc_action_key] = 'access_list'
    example.metadata[:rpdoc_action_name] = 'change system ca access member list'
    example.metadata[:rpdoc_example_folders] = ['V1', 'system_cas']

    @member = mock_member(:member_me, skip_auth: true)
    @member_a = mock_member(:member_a, skip_auth: true)
    @member_b = mock_member(:member_b, skip_auth: true)
    @system_ca = FactoryBot.create(:system_ca, group: @default_group, member: @member_b)

    @headers = {
      'Authorization' => 'Bearer {{rabbit_token}}',
      'Content-Type' => 'application/json'
    }
    @path = '/api/v1/system_cas/access_list'

    @params = {
      id: @system_ca.id,
      members: [
        @member.email,
        @member_a.email
      ]
    }
  end

  describe '#access_list', mock_default_group: true do

    it 'should return 200 and return updated system ca', rpdoc_example_key: 200, rpdoc_example_name: 'change sysmem ca member access list success' do
      put @path, params: @params.to_json, headers: @headers

      expect(response).to have_http_status(200)
      expect(json['data']['id']).to eq(@system_ca.id)

      @system_ca.reload
      expect(@system_ca.accessor_emails - @params[:members]).to be_empty
    end

    it 'should return 404 if group not found', rpdoc_example_key: 404_205, rpdoc_example_name: '404 group not found' do
      mock_member(:member_me)

      put @path, params: @params.to_json, headers: @headers

      expect(response).to have_http_status(404)
      expect(json['error_code']).to eq(404205)
      expect(json['error_key']).to eq('group_not_found')
    end

    it 'should return 403 if is not admin', rpdoc_example_key: 403_056, rpdoc_example_name: '403 member not accessible' do
      member = mock_member(:member_me)
      mock_group(member)

      put @path, params: @params.to_json, headers: @headers

      expect(response).to have_http_status(403)
      expect(json['error_code']).to eq(403056)
      expect(json['error_key']).to eq('group_not_accessible')
    end

  end
end
