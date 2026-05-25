require 'rails_helper'

RSpec.describe Api::V1::Envelopes::ChangeController, type: :request do
  include_context 'rpdoc'

  let(:actor)     { mock_member(:member_me, skip_auth: false) } # 注意：example 不能直接用在 let
  let(:new_owner) { create(:member_a) }
  let(:envelope)  { create(:waiting_for_me_envelope) }

  let(:headers) do
    {
      'Content-Type' => 'application/json',
      'Authorization' => 'Bearer {{rabbit_token}}'
    }
  end

  def new_owner_params(email)
    { new_owner: { email: email } }
  end

  def change_owner_request(envelope, params:)
    post change_owner_api_v1_envelope_path(envelope.id),
         params: params.to_json,
         headers: headers
  end

  before(:each) do |example|
    example.metadata[:rpdoc_action_key] = 'change_owner'
    example.metadata[:rpdoc_action_name] = 'change owner of envelope'
    example.metadata[:rpdoc_example_folders] = %w[v1 envelopes change]

    mock_group(actor)
  end

  describe 'POST /change_owner' do
    context 'success' do
      before(:each) { mock_group(new_owner) }

      it 'transfers the ownership of the envelope to a new user' do
        change_owner_request(envelope, params: new_owner_params(new_owner.email))

        expect(response).to have_http_status(:ok)
        expect(envelope.reload.owner).to eq(new_owner)
        expect(envelope.group_id).to eq(new_owner.group_id)
      end

      it 'transfers the ownership of the envelope to a new user by none group actor' do
        none_group_actor = mock_member(:member_me, skip_auth: false)
        mock_group_kick(none_group_actor)
        change_owner_request(envelope, params: new_owner_params(new_owner.email))

        expect(response).to have_http_status(:ok)
        expect(envelope.reload.owner).to eq(new_owner)
        expect(envelope.group_id).to eq(new_owner.group_id)
      end
      it 'transfers the ownership of the envelope to a none group user by none group actor' do
        none_group_actor = mock_member(:member_me, skip_auth: false)
        mock_group_kick(none_group_actor)
        mock_group_kick(new_owner)
        change_owner_request(envelope, params: new_owner_params(new_owner.email))

        expect(response).to have_http_status(:ok)
        expect(envelope.reload.owner).to eq(new_owner)
        expect(envelope.group_id).to eq(new_owner.group_id)
      end
    end

    context 'return error' do
      before(:each) { mock_group(new_owner) }

      it 'returns an error if the new owner does not exist' do
        change_owner_request(envelope, params: new_owner_params('fail@example.com'))

        expect(response).to have_http_status(404)
        expect(json['error_key']).to eq('member_not_found')
      end

      it 'returns an error if the actor is not the owner' do
        mock_member(:member_b) # new signer
        change_owner_request(envelope, params: new_owner_params(new_owner.email))

        expect(response).to have_http_status(403)
        expect(json['error_key']).to eq('not_owner')
      end

      it 'returns an error if the new owner not in same group' do
        mock_group_kick(new_owner)
        change_owner_request(envelope, params: new_owner_params(new_owner.email))

        expect(response).to have_http_status(403)
        expect(json['error_key']).to eq('not_group_member')
      end
    end

    context 'when envelope is not transferable' do
      let(:envelope) { create(:draft_envelope) }

      before(:each) { mock_group(new_owner) }

      it 'returns envelope_not_transferable' do
        change_owner_request(envelope, params: new_owner_params(new_owner.email))

        expect(response).to have_http_status(403)
        expect(json['error_key']).to eq('envelope_not_transferable')
      end
    end
  end
end
