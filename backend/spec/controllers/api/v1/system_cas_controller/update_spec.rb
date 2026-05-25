require 'openssl'
require 'rails_helper'

RSpec.describe Api::V1::SystemCasController, type: :request do
  include_context 'rpdoc'

  before(:each) do |example|
    example.metadata[:rpdoc_action_key] = 'update'
    example.metadata[:rpdoc_action_name] = 'update system ca'
    example.metadata[:rpdoc_example_folders] = ['V1', 'system_cas']

    mock_hsm_service

    @member = mock_member(:member_me, skip_auth: true)
    @system_ca = FactoryBot.create(:system_ca, group: @default_group, member: @member)

    @headers = {
      'Authorization' => 'Bearer {{rabbit_token}}',
      'Content-Type' => 'application/json'
    }
    @path = '/api/v1/system_cas'

    @params = {
      id: @system_ca.id,
      name: "test2",
      cluster_id: "new_cluster_id",
      token: "new_token",
      email: "new_email@example.com",
      pem: OpenSSL::PKey::RSA.new(2048).to_s
    }
  end

  describe '#update', mock_default_group: true do

    it 'should return 200 and return updated system ca', rpdoc_example_key: 200, rpdoc_example_name: 'update sysmem ca success' do
      put @path, params: @params.to_json, headers: @headers

      expect(response).to have_http_status(200)
      expect(json['data']['id']).to eq(@system_ca.id)

      @system_ca = SystemCa.first
      expect(@system_ca.name).to eq(@params[:name])
      expect(@system_ca.cluster_id).to eq(@params[:cluster_id])
      expect(@system_ca.token).to eq(@params[:token])
      expect(@system_ca.email).to eq(@params[:email])
      expect(@system_ca.pem).to eq(@params[:pem])
    end

    it 'should not update column with empty param', rpdoc_example_key: 200_2, rpdoc_example_name: 'should not update column with empty param' do
      @params.each { |k, _| @params[k] = '' unless k == :id }

      old_ca = SystemCa.first

      put @path, params: @params.to_json, headers: @headers

      expect(response).to have_http_status(200)

      @system_ca = SystemCa.first
      expect(json['data']['id']).to eq(@system_ca.id)
      expect(json['data']['cluster_id']).to eq(@system_ca.cluster_id)
      expect(json['data']['token']).to eq(@system_ca.token)
      expect(json['data']['email']).to eq(@system_ca.email)

      expect(@system_ca.cluster_id).to eq(old_ca.cluster_id)
      expect(@system_ca.token).to eq(old_ca.token)
      expect(@system_ca.email).to eq(old_ca.email)
      expect(@system_ca.pem).to eq(old_ca.pem)
    end

    it 'should return 400 if provided attr is invalid', rpdoc_example_key: 400_800, rpdoc_example_name: '400 if provided attr is invalid' do
      allow(DigitalCertificate::Hsm).to receive(:apply_ap_cert).and_return({ 'status' => '500' })

      put @path, params: @params.to_json, headers: @headers

      expect(response).to have_http_status(400)
      expect(json['error_code']).to eq(400087)
      expect(json['error_key']).to eq('digit_sign_failed')
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
      mock_group(member, role: 'manager')

      put @path, params: @params.to_json, headers: @headers

      expect(response).to have_http_status(403)
      expect(json['error_code']).to eq(403056)
      expect(json['error_key']).to eq('group_not_accessible')
    end

  end
end
