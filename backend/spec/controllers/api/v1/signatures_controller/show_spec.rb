require 'rails_helper'

RSpec.describe Api::V1::SignaturesController, type: :request do
  include_context 'redis_cache'
  include_context 'rpdoc'

  before(:each) do |example|
    example.metadata[:rpdoc_action_key] = 'show'
    example.metadata[:rpdoc_action_name] = 'show signature'
    example.metadata[:rpdoc_example_folders] = ['v1', 'signatures']
    mock_service(SignatureVideo::FetchBase64, result: "mp4 base64 encoded string")
    @member = mock_member(:member_me, skip_auth: example.metadata[:skip_auth])
    @signature = FactoryBot.create(:signature, member: @member)
    FactoryBot.create(:uploaded_file, storable: @signature, label: 'signature_raw')
    @headers = {
      'Authorization' => 'Bearer {{rabbit_token}}'
    }
    @path = "/api/v1/signatures/#{@signature.id}"
    mock_signature
  end

  describe '#show' do
    it 'should return 200 if get signature success', rpdoc_example_key: 200, rpdoc_example_name: 'show signatures success' do
      get @path, headers: @headers
      expect(response).to have_http_status(200)
    end

    it 'should return 400003 if invalid member', rpdoc_example_key: 400003, rpdoc_example_name: 'show signatures failed (invalid member)', skip_auth: true do
      @headers['Authorization'] = 'Bearer invalid-token'
      get @path, headers: @headers
      expect(response).to have_http_status(400)
      expect(json['error_code']).to eq(400003)
      expect(json['error_key']).to eq('invalid_member')
    end
  end
end
