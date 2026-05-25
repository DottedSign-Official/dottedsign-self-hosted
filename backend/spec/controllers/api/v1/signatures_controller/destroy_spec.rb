require 'rails_helper'

RSpec.describe Api::V1::SignaturesController, type: :request do
  include_context 'redis_cache'
  include_context 'rpdoc'

  before(:each) do |example|
    example.metadata[:rpdoc_action_key] = 'destroy'
    example.metadata[:rpdoc_action_name] = 'delete signature'
    example.metadata[:rpdoc_example_folders] = ['v1', 'signatures']

    @headers = {
      'Content-Type' => 'application/json'
    }
    @path = '/api/v1/signatures'
  end

  describe '#destroy' do
    context '[normal destroy]' do
      before(:each) do |example|
        @member = mock_member(:member_me, skip_auth: example.metadata[:skip_auth])
        signature = FactoryBot.create(:signature, member: @member)
        @headers['Authorization'] = 'Bearer {{rabbit_token}}'
        @path += "/#{signature.id}"
      end

      it 'should retrun 200 if delete success', rpdoc_example_key: 404030, rpdoc_example_name: 'delete signature success' do
        delete @path, headers: @headers
        expect(response).to have_http_status(200)
      end

      it 'should return 404030 if signature not found', rpdoc_example_key: 404030, rpdoc_example_name: 'delete signature failed (signature not found)' do
        member = mock_member(:member_a)
        delete @path, headers: @headers
        expect(response).to have_http_status(404)
        expect(json['error_code']).to eq(404030)
        expect(json['error_key']).to eq('signature_not_found')
      end

      it 'should return 400003 if invalid member', rpdoc_example_key: 400003, rpdoc_example_name: 'delete signature failed (invalid member)', skip_auth: true do
        @headers['Authorization'] = 'Bearer invalid-token'
        delete @path, headers: @headers
        expect(response).to have_http_status(400)
        expect(json['error_code']).to eq(400003)
        expect(json['error_key']).to eq('invalid_member')
      end
    end
  end
end
