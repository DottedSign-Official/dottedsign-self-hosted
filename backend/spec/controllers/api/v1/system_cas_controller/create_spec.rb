require 'rails_helper'

RSpec.describe Api::V1::SystemCasController, type: :request do
  include_context 'rpdoc'

  before(:each) do |example|
    example.metadata[:rpdoc_action_key] = 'create'
    example.metadata[:rpdoc_action_name] = 'create system ca'
    example.metadata[:rpdoc_example_folders] = ['V1', 'system_cas']

    mock_hsm_service

    @headers = {
      'Authorization' => 'Bearer {{rabbit_token}}',
      'Content-Type' => 'application/json'
    }
    @path = '/api/v1/system_cas'

    @params = {
      name: "test",
      cluster_id: "cluster_id",
      token: "token",
      email: "system_ca@example.com",
      pem: OpenSSL::PKey::RSA.new(2048).to_pem
    }
  end

  describe '#create', mock_default_group: true do

    it 'should return 200 and return new system ca', rpdoc_example_key: 200, rpdoc_example_name: 'create sysmem ca success' do
      expect {
        post @path, params: @params.to_json, headers: @headers

        expect(response).to have_http_status(200)
        expect(json['data']['id']).not_to be(nil)
      }.to change(SystemCa, :count).by 1

    end

    it 'should return 404 if group not found', rpdoc_example_key: 404_205, rpdoc_example_name: '404 group not found' do
      mock_member(:member_me)

      post @path, params: @params.to_json, headers: @headers

      expect(response).to have_http_status(404)
      expect(json['error_code']).to eq(404205)
      expect(json['error_key']).to eq('group_not_found')
    end

    it 'should return 400 if provided attr is invalid', rpdoc_example_key: 400_800, rpdoc_example_name: '400 if provided attr is invalid' do
      allow(DigitalCertificate::Hsm).to receive(:apply_ap_cert).and_return({ 'status' => '500' })

      post @path, params: @params.to_json, headers: @headers

      expect(response).to have_http_status(400)
      expect(json['error_code']).to eq(400087)
      expect(json['error_key']).to eq('digit_sign_failed')
      expect(SystemCa.count).to eq(0)
    end

    it 'should return 403 if is not admin', rpdoc_example_key: 403_056, rpdoc_example_name: '403 member not accessible' do
      member = mock_member(:member_me)
      mock_group(member, role: 'manager')

      post @path, params: @params.to_json, headers: @headers

      expect(response).to have_http_status(403)
      expect(json['error_code']).to eq(403056)
      expect(json['error_key']).to eq('group_not_accessible')
    end

    it 'should failed with empty params', rpdoc_example_key: 400_001, rpdoc_example_name: 'failed with empty params' do
      @params.each { |k, _| @params[k] = '' }

      post @path, params: @params.to_json, headers: @headers

      expect(response).to have_http_status(400)
      expect(json['error_code']).to eq(400001)
      expect(json['error_key']).to eq('need_more_information')
    end

  end
end
