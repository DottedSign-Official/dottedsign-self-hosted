require 'rails_helper'

RSpec.describe Api::Internal::SignaturesController, type: :request do
  include_context 'rpdoc'

  before(:each) do |example|
    example.metadata[:rpdoc_action_key] = 'show'
    example.metadata[:rpdoc_action_name] = 'show signature '
    example.metadata[:rpdoc_example_folders] = ['internal', 'signatures']
    @member = mock_member(:member_me, skip_auth: example.metadata[:skip_auth])
    @signature = FactoryBot.create(:signature, member: @member)
    FactoryBot.create(:uploaded_file, storable: @signature, label: 'signature_raw')
    mock_service(SignatureVideo::FetchBase64, result: "mp4 base64 encoded string")
    mock_signature
    @path = "/api/internal/signatures/#{@signature.id}"
  end

  describe '#get' do
    it 'should return 200', rpdoc_example_key: 200, rpdoc_example_name: 'show signature success' do
      get @path, headers: @headers
      expect(response).to have_http_status(200)
    end
  end

end
