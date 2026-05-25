require 'rails_helper'

RSpec.describe Api::V1::SignaturesController, type: :request do
  include_context 'redis_cache'
  include_context 'rpdoc'

  before(:each) do |example|
    example.metadata[:rpdoc_action_key] = 'index'
    example.metadata[:rpdoc_action_name] = 'list signatures'
    example.metadata[:rpdoc_example_folders] = ['v1', 'signatures']

    @member = mock_member(:member_me, skip_auth: example.metadata[:skip_auth])
    @headers = {
      'Authorization' => 'Bearer {{rabbit_token}}'
    }
    @path = '/api/v1/signatures'
    mock_signature
  end

  describe '#index' do
    before(:each) do
      initial = FactoryBot.create(:signature, member: @member, category: 'initial')
      signature = FactoryBot.create(:signature, member: @member)
      stamp_signatures = FactoryBot.create_list(:signature, 5, member: @member, category: 'stamp')
      photo_signatures = FactoryBot.create_list(:signature, 5, member: @member, category: 'signature_with_photo')
      [initial, signature, *stamp_signatures, *photo_signatures].each do |signature|
        FactoryBot.create(:uploaded_file, storable: signature, label: 'signature_raw')
      end
      photo_signatures.each do |signature|
        FactoryBot.create(:uploaded_file, storable: signature, label: 'signature_photo')
      end
    end

    it 'should return 200 if get signature list success', rpdoc_example_key: 200, rpdoc_example_name: 'list signatures success' do
      get @path, headers: @headers
      expect(response).to have_http_status(200)
      expect(json['data'].length).to eq(7)
    end

    it 'should return 400003 if invalid member', rpdoc_example_key: 400003, rpdoc_example_name: 'list signatures failed (invalid member)', skip_auth: true do
      @headers['Authorization'] = 'Bearer invalid-token'
      get @path, headers: @headers
      expect(response).to have_http_status(400)
      expect(json['error_code']).to eq(400003)
      expect(json['error_key']).to eq('invalid_member')
    end
  end
end
