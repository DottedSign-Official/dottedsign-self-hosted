require 'rails_helper'

RSpec.describe Api::V1::SignaturesController, type: :request do
  include_context 'redis_cache'
  include_context 'rpdoc'

  before(:each) do |example|
    example.metadata[:rpdoc_action_key] = 'create'
    example.metadata[:rpdoc_action_name] = 'create signature'
    example.metadata[:rpdoc_example_folders] = ['v1', 'signatures']

    @headers = {
      'Content-Type' => 'application/json'
    }
    @path = '/api/v1/signatures'
    mock_upload
    mock_signature
  end

  describe '#create' do
    before(:each) do
      @params = {
        category: 'initial',
        file_type: 'png',
        raw: Base64.strict_encode64('image'),
        sign_video: "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"
      }
    end

    context '[normal create]' do
      before(:each) do |example|
        @headers['Authorization'] = 'Bearer {{rabbit_token}}'
        @member = mock_member(:member_me, skip_auth: example.metadata[:skip_auth])
      end

      it 'should return 200 if create success', rpdoc_example_key: 200_1, rpdoc_example_name: 'create signature success (registered member create)' do
        post @path, params: @params.to_json, headers: @headers

        signature = Signature.find_by(category: @params[:category])
        expect(response).to have_http_status(200)
        expect(signature.raw_file_base64).to eq(@params[:raw])
        expect(json['data']['category']).to eq(@params[:category])
        expect(json['data']['file_type']).to eq(@params[:file_type])
        expect(json['data']['raw']).to eq(@params[:raw])
      end

      it 'should return 200 if create second stamp success', rpdoc_example_key: 200_2, rpdoc_example_name: 'create second stamp signature success (registered member create)' do
        signature = FactoryBot.create(:signature, :stamp, member: @member)
        params = signature.as_json.merge(raw: signature.raw_file_base64)
        post @path, params: params.to_json, headers: @headers
        expect(response).to have_http_status(200)
        expect(json['data']['category']).to eq(signature[:category])
        expect(json['data']['file_type']).to eq(signature[:file_type])
        expect(json['data']['raw']).to eq(signature.raw_file_base64)
      end

      it 'should return 200 if create signature with photo and stroke success', rpdoc_example_key: 200_3, rpdoc_example_name: 'create signature with photo success (registered member create)' do
        @params[:category] = 'signature_with_photo'
        @params[:sign_photo] = Base64.strict_encode64('image')
        @params[:sign_stroke] = 'text'
        post @path, params: @params.to_json, headers: @headers
        expect(response).to have_http_status(200)
        expect(json['data']['category']).to eq(@params[:category])
        expect(json['data']['file_type']).to eq(@params[:file_type])

        signature = Signature.find_by(id: json['data']['id'])
        expect(signature.photo_file.present?).to eq(true)
        expect(signature.stroke_file.present?).to eq(true)
      end

      it 'should return 200 if create second signature with photo success', rpdoc_example_key: 200_4, rpdoc_example_name: 'create second signature with photo success (registered member create)' do
        signature = FactoryBot.create(:signature, :signature_with_photo, member: @member)
        @params[:category] = 'signature_with_photo'
        @params[:sign_photo] = Base64.strict_encode64('image')
        @params[:sign_stroke] = 'text'
        post @path, params: @params.to_json, headers: @headers
        expect(response).to have_http_status(200)
        expect(json['data']['category']).to eq(@params[:category])
        expect(json['data']['file_type']).to eq(@params[:file_type])
      end

      it 'should return 400057 if file type is not allowed', rpdoc_example_key: 400057, rpdoc_example_name: 'create signature failed (file type not allowed)' do
        @params[:file_type] = 'unknown'
        post @path, params: @params.to_json, headers: @headers
        expect(response).to have_http_status(400)
        expect(json['error_code']).to eq(400057)
      end

      it 'should return 400003 if invalid member', rpdoc_example_key: 400003, rpdoc_example_name: 'create signature failed (invalid member)', skip_auth: true do
        @headers['Authorization'] = 'Bearer invalid-token'
        post @path, params: @params.to_json, headers: @headers
        expect(response).to have_http_status(400)
        expect(json['error_code']).to eq(400003)
        expect(json['error_key']).to eq('invalid_member')
      end

      it 'should return 4001312 if create stamp when already have 20 stamps', rpdoc_example_key: 4001316, rpdoc_example_name: 'create stamp signature failed (stamp_limit_reached)' do
        20.times do
          FactoryBot.create(:signature, :stamp, member: @member)
        end
        @params[:category] = 'stamp'
        post @path, params: @params.to_json, headers: @headers
        expect(response).to have_http_status(400)
        expect(json['error_code']).to eq(4001316)
        expect(json['error_key']).to eq('stamp_limit_reached')
      end
    end

    context '[quick create]' do
      before(:each) do
        task = FactoryBot.create(:quick_sign_task)
        quick_sign_params = {
          client: 'web',
          ip_address: '0.0.0.0',
          work_id: 'random_work_id',
          code: task.original_file.preview_code(task.processing_stages[0], will_expired: true),
        }
        consent_params = quick_sign_params.merge({check: true})
        post '/api/v1/sign_tasks/consent', params: consent_params

        @params = @params.merge(quick_sign_params)
      end

      it 'should return 200 if create success', rpdoc_example_key: 200_2, rpdoc_example_name: 'create signature success (non registered member create)' do
        post @path, params: @params.to_json, headers: @headers

        signature = Signature.find_by(category: @params[:category])
        expect(response).to have_http_status(200)
        expect(signature.raw_file_base64).to eq(@params[:raw])
        expect(json['data']['category']).to eq(@params[:category])
        expect(json['data']['file_type']).to eq(@params[:file_type])
        expect(json['data']['raw']).to eq(@params[:raw])
      end
    end
  end
end
