require 'rails_helper'

RSpec.describe Api::V1::Members::AuthController, type: :request do
  include_context 'rpdoc'

  before(:each) do |example|
    example.metadata[:rpdoc_action_key] = 'create'
    example.metadata[:rpdoc_action_name] = 'create member'
    example.metadata[:rpdoc_example_folders] = ['v1', 'members', 'auth']

    @member = mock_member(:member_me, skip_auth: example.metadata[:skip_auth])
    @headers = {
      'Content-Type' => 'application/json',
      'Authorization' => 'Bearer {{rabbit_token}}'
    }
    @path = '/api/v1/members/register'
  end

  describe '#create' do
    before(:each) do
      client = mock_client
      @params = {
        client_id: client.uid,
        client_secret: client.secret,
        email: 'rabbit@gmail.com',
        name: 'New Member',
        password: 'password'
      }
    end

    it 'should return 200', rpdoc_example_key: 200, rpdoc_example_name: 'create member success' do
      post @path, params: @params.to_json, headers: @headers
      expect(response).to have_http_status(200)
      member = Member.last
      expect(member.email).to eq(@params[:email])
    end

    it 'should create one new member', rpdoc_skip: true do
      expect{post @path, params: @params.to_json, headers: @headers}.to change{Member.count}.by(1)
    end

    it 'should return 400201 if invalid domain', rpdoc_example_key: 400201, rpdoc_example_name: 'create member failed (invalid_domain)' do
      @params[:email] = 'test@test.com'
      post @path, params: @params.to_json, headers: @headers
      expect(response).to have_http_status(400)
      expect(json['error_code']).to eq(400201)
      expect(json['error_key']).to eq('invalid_domain')
    end

    it 'should return 400220 if email format is not valid', rpdoc_example_key: 400220, rpdoc_example_name: 'create member failed (invalid_format)' do
      params = @params.merge({
        email: 'invalid-email-format',
        password: 'testtest'
      })
      post @path, params: params
      expect(response).to have_http_status(400)
      expect(json['error_code']).to eq(400220)
      expect(json['error_key']).to eq('email_format_invalid')
    end

    it 'should return 404208', rpdoc_example_key: 404208, rpdoc_example_name: 'create member failed (client invalid)' do
      @params[:client_id] = 'fake_client_id'
      post @path, params: @params.to_json, headers: @headers
      expect(response).to have_http_status(404)
      expect(json['error_code']).to eq(404208)
      expect(json['error_key']).to eq('client_not_found')
    end

    it 'should return 402001 if email is already exist', rpdoc_example_key: 402001, rpdoc_example_name: 'create member failed (email already exist)' do
      @ada = create(:member_a)
      params = @params.merge({
        email: @ada.email,
        password: 'testtest'
      })
      post @path, params: params
      expect(response).to have_http_status(402)
      expect(json['error_code']).to eq(402001)
      expect(json['error_key']).to eq('email_already_taken')
    end
  end
end
