require 'rails_helper'

RSpec.describe Api::V1::EnvelopesController, type: :request do
  include_context 'rpdoc'

  before(:each) do |example|
    example.metadata[:rpdoc_action_key] = 'destroy'
    example.metadata[:rpdoc_action_name] = 'delete envelope'
    example.metadata[:rpdoc_example_folders] = ['v1', 'envelopes']

    @member = mock_member(:member_me, skip_auth: example.metadata[:skip_auth])
    @envelope = FactoryBot.create(:waiting_for_me_envelope)
    @headers = {
      'Content-Type' => 'application/json',
      'Authorization' => 'Bearer {{rabbit_token}}'
    }
    @path = "/api/v1/envelopes/#{@envelope.id}"
  end

  describe '#destroy' do
    it 'should return 200 if envelope is processing', rpdoc_example_key: 200, rpdoc_example_name: 'destroy envelope success' do
      delete @path, headers: @headers
      @envelope.reload
      @envelope.sign_tasks.reload
      expect(response).to have_http_status(200)
      expect(@envelope.status).to eq('deleted')
      expect(@envelope.sign_tasks.first.status).to eq('deleted')
    end

    it 'should return 400_090 if envelope is completed', rpdoc_example_key: 400_090, rpdoc_example_name: 'delete envelope failed (envelope already completed)' do
      @envelope.completed!
      delete @path, headers: @headers
      expect(response).to have_http_status(400)
      expect(json['error_code']).to eq(400090)
    end

    it 'should return 404_048 if envelope not found', rpdoc_example_key: 404_048, rpdoc_example_name: 'destroy envelope failed (envelope not found)' do
      @path = "/api/v1/envelopes/0"
      delete @path, headers: @headers
      expect(response).to have_http_status(404)
    end

    it 'should return 400_003 if invalid member', rpdoc_example_key: 400_003, rpdoc_example_name: 'destroy envelope failed (invalid member)', skip_auth: true do
      @headers['Authorization'] = "Bearer invalid-token"
      delete @path, headers: @headers
      expect(response).to have_http_status(400)
      expect(json['error_code']).to eq(400003)
      expect(json['error_key']).to eq('invalid_member')
    end

    context '>> in group' do
      before(:each) do
        FactoryBot.create(:group_member)
        mock_group(@member)
      end

      context '>>> self sender (invite envelope)' do
        before(:each) do
          @envelope = FactoryBot.create(:me_sender_waiting_envelope)
          @path = "/api/v1/envelopes/#{@envelope.id}"
        end

        include_examples 'group_allow_examples', 'delete', 'delete_processing_task', 'self_sender', 200_01
        include_examples 'group_envelope_forbid_examples', 'delete', 'delete_processing_task', 'self_sender', 403067_01
      end
    end
  end
end
