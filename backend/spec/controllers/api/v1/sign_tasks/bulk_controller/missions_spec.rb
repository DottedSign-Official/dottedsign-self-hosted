require 'rails_helper'

RSpec.describe Api::V1::SignTasks::BulkController, type: :request do
  include_context 'rpdoc'

  before(:each) do |example|
    example.metadata[:rpdoc_action_key] = 'missions'
    example.metadata[:rpdoc_action_name] = 'list bulk missions'
    example.metadata[:rpdoc_example_folders] = ['v1', 'sign_tasks', 'bulk']

    build_test_members
    @member = mock_member(:member_me, skip_auth: example.metadata[:skip_auth])
    @headers = {'Authorization' => 'Bearer {{rabbit_token}}'}
    @path = '/api/v1/sign_tasks/bulk/missions'
  end

  describe '#missions' do
    before(:each) do
      @params = {
        page: 2,
        per_page: 2
      }
    end

    it 'should return 200 and get missions', rpdoc_example_key: 200, rpdoc_example_name: 'list bulk missions success' do
      FactoryBot.create_list(:completed_mission, 5)
      get "#{@path}?#{URI.encode_www_form(@params)}", headers: @headers
      expect(response).to have_http_status(200)
      expect(json['data']['missions'].length).to eq(2)
      expect(json['data']['current_page']).to eq(2)
      expect(json['data']['total_pages']).to eq(3)
    end

    it 'should return 400003 if invalid member', rpdoc_example_key: 400003, rpdoc_example_name: 'list bulk missions failed (invalid member)', skip_auth: true do
      @headers['Authorization'] = 'Bearer invalid-token'
      get "#{@path}?#{URI.encode_www_form(@params)}", headers: @headers
      expect(response).to have_http_status(400)
      expect(json['error_code']).to eq(400003)
      expect(json['error_key']).to eq('invalid_member')
    end

    context '>> in group' do
      before(:each) do
        FactoryBot.create(:group_member)
        mock_group(@member)
      end

      include_examples 'group_allow_examples', 'get', 'bulk_send', 'self_sender', 200_01
      include_examples 'group_forbid_examples', 'get', 'bulk_send', 'self_sender', 403036_01
    end
  end

end
