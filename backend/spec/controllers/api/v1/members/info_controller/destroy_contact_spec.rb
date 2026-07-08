require 'rails_helper'

RSpec.describe Api::V1::Members::InfoController, type: :request do
  include_context 'rpdoc'

  before(:each) do |example|
    example.metadata[:rpdoc_action_key] = 'destroy_contact'
    example.metadata[:rpdoc_action_name] = 'delete member contact'
    example.metadata[:rpdoc_example_folders] = ['v1', 'members', 'info']

    @member = mock_member(:member_me, skip_auth: example.metadata[:skip_auth])
    @headers = {
      'Authorization' => 'Bearer {{rabbit_token}}',
      'Content-Type' => 'application/json'
    }
    @path = '/api/v1/members/contact'
  end

  describe '#destroy_contact' do
    before(:each) do
      @contact = FactoryBot.create(:contact, member: @member)
      @params = { email: @contact.email }
    end

    it 'should return 200 and delete member contact', rpdoc_example_key: 200, rpdoc_example_name: 'delete member contact success' do
      expect do
        delete @path, params: @params.to_json, headers: @headers
      end.to change { @member.contacts.count }.by(-1)

      expect(response).to have_http_status(200)
    end

    it 'should return 404202 if contact not exist', rpdoc_example_key: 404202, rpdoc_example_name: 'delete member contact failed (contact not exist)' do
      @params[:email] = 'not-found@test.com'
      delete @path, params: @params.to_json, headers: @headers

      expect(response).to have_http_status(404)
      expect(json['error_code']).to eq(404_202)
      expect(json['error_key']).to eq('contact_not_exist')
    end

    it 'should return 400220 if email format is not valid', rpdoc_example_key: 400220, rpdoc_example_name: 'delete member contact failed (invalid email format)' do
      @params[:email] = 'invalid_email_format'
      delete @path, params: @params.to_json, headers: @headers

      expect(response).to have_http_status(400)
      expect(json['error_code']).to eq(400_220)
      expect(json['error_key']).to eq('email_format_invalid')
    end

    it 'should return 400003 if invalid member', rpdoc_example_key: 400003, rpdoc_example_name: 'delete member contact failed (invalid member)', skip_auth: true do
      @headers['Authorization'] = 'Bearer invalid-token'
      delete @path, params: @params.to_json, headers: @headers

      expect(response).to have_http_status(400)
      expect(json['error_code']).to eq(400003)
      expect(json['error_key']).to eq('invalid_member')
    end
  end
end
