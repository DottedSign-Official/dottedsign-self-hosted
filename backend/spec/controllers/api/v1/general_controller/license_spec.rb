require 'rails_helper'

RSpec.describe '/api/v1/license_info', type: :request do
  include_context 'rpdoc'

  before(:each) do |example|
    example.metadata[:rpdoc_action_key] = 'get_license_info'
    example.metadata[:rpdoc_action_name] = '取得 license 資訊'
    example.metadata[:rpdoc_example_folders] = ['v1', 'general']

    @headers = { 'Content-Type' => 'application/json' }
    @path = "/api/v1/license_info"

    stub_const('LICENSE_KEY', 'dummy_license_key')
    license = OpenStruct.new(
      expires_at: nil,
      restrictions: {
        group_enable: true,
        template: {},
        sign_task: true,
        otp_verify: {},
        authenticate_member: true,
        certificate_authority: {}
      }
    )
    verify = double('verify', failed?: false, license: license, error: double(key: :invalid_license))
    allow(OnPremiseLicense::Verify).to receive(:call).with('dummy_license_key').and_return(verify)
  end

  context '#show' do

    it 'should return 200', rpdoc_example_key: 200, rpdoc_example_name: 'show license_info success' do
      get @path, headers: @headers
      expect(response).to have_http_status(200)
    end
  end

end
