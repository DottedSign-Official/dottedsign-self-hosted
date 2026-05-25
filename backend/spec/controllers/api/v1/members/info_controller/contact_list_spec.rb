require 'rails_helper'

RSpec.describe Api::V1::Members::InfoController, type: :request do
  include_context 'rpdoc'

  before(:each) do |example|
    example.metadata[:rpdoc_action_key] = 'contact_list'
    example.metadata[:rpdoc_action_name] = 'get member contact list'
    example.metadata[:rpdoc_example_folders] = ['v1','members', 'info']

    @member = mock_member(:member_me, skip_auth: example.metadata[:skip_auth])
    @headers = {'Authorization' => 'Bearer {{rabbit_token}}'}
    @path = '/api/v1/members/contact_list'
  end

  describe '#contact_list' do

    it 'should return 200 and get member contact list', rpdoc_example_key: 200, rpdoc_example_name: 'get member contact list success' do
      FactoryBot.create(:contact, member: @member)
      FactoryBot.create(:contact, member: @member)
      get @path, headers: @headers
      expect(response).to have_http_status(200)
      expect(json['data'].length).to eq(2)
    end

    it 'should return 400003 if invalid member', rpdoc_example_key: 400003, rpdoc_example_name: 'get member contact list failed (invalid member)', skip_auth: true do
      @headers['Authorization'] = 'Bearer invalid-token'
      get @path, headers: @headers
      expect(response).to have_http_status(400)
      expect(json['error_code']).to eq(400003)
      expect(json['error_key']).to eq('invalid_member')
    end
  end
end
