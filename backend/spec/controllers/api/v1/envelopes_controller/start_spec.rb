require 'rails_helper'

RSpec.describe Api::V1::EnvelopesController, type: :request do
  include_context 'rpdoc'

  before(:each) do |example|
    example.metadata[:rpdoc_action_key] = 'start'
    example.metadata[:rpdoc_action_name] = 'start envelope signing flow'
    example.metadata[:rpdoc_example_folders] = ['v1', 'envelopes']

    @member = mock_member(:member_me, skip_auth: example.metadata[:skip_auth])
    @headers = {
      'Authorization' => 'Bearer {{rabbit_token}}',
      'Content-Type' => 'application/json'
    }
    @path = '/api/v1/envelopes/start'
  end

  describe '#start' do
    before(:each) do
      @envelope = FactoryBot.create(:draft_envelope)
      @params = {
        envelope_id: @envelope.id
      }
    end

    it 'should return 200 if envelope is draft', rpdoc_example_key: 200, rpdoc_example_name: 'start envelope flow success' do
      post @path, params: @params.to_json, headers: @headers
      @envelope.reload
      @envelope.dummy_stages.reload
      @envelope.sign_tasks.reload
      @envelope.sign_tasks.first.sign_stages.reload
      expect(response).to have_http_status(200)
      expect(@envelope.status).to eq('waiting')
      expect(@envelope.dummy_stages.first.status).to eq('processing')
      expect(@envelope.sign_tasks.first.status).to eq('waiting')
      expect(@envelope.sign_tasks.first.sign_stages.first.status).to eq('processing')
    end

    it 'should return 400_089 if envelope is processing', rpdoc_example_key: 400_089_1, rpdoc_example_name: 'start envelope flow failed (envelope already processing)' do
      envelope = FactoryBot.create(:waiting_for_me_envelope)
      @params[:envelope_id] = envelope.id
      post @path, params: @params.to_json, headers: @headers
      expect(response).to have_http_status(400)
      expect(json['error_code']).to eq(400089)
    end

    it 'should return 400_089 if envelope is completed', rpdoc_example_key: 400_089_2, rpdoc_example_name: 'start envelope flow failed (envelope already completed)' do
      envelope = FactoryBot.create(:completed_envelope)
      @params[:envelope_id] = envelope.id
      post @path, params: @params.to_json, headers: @headers
      expect(response).to have_http_status(400)
      expect(json['error_code']).to eq(400089)
    end

    it 'should return 400_003 if invalid member', rpdoc_example_key: 400_003, rpdoc_example_name: 'start envelope flow failed (invalid member)', skip_auth: true do
      @headers['Authorization'] = "Bearer invalid-token"
      post @path, params: @params.to_json, headers: @headers
      expect(response).to have_http_status(400)
      expect(json['error_code']).to eq(400003)
      expect(json['error_key']).to eq('invalid_member')
    end
  end
end