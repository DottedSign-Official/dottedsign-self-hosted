require 'rails_helper'

RSpec.describe Api::V1::Members::InfoController, type: :request do
  include_context 'rpdoc'

  before(:each) do |example|
    example.metadata[:rpdoc_action_key] = 'timelines'
    example.metadata[:rpdoc_action_name] = 'get member timelines'
    example.metadata[:rpdoc_example_folders] = ['v1','members', 'info']

    @member = mock_member(:member_me, skip_auth: example.metadata[:skip_auth])
    @headers = {
      'Authorization' => 'Bearer {{rabbit_token}}'
    }
    @path = '/api/v1/members/timelines'
  end

  describe '#timelines' do

    it 'should return 200 and get events for creating and signing a task', rpdoc_example_key: 200_1, rpdoc_example_name: 'get timelines of member success' do
      FactoryBot.create(:completed_task2)
      get @path, headers: @headers
      expect(response).to have_http_status(200)
      expect(json['data']['timelines'].length).to eq(3)
      expect(json['data']['timelines'][0]['action_name']).to eq('signed')
      expect(json['data']['timelines'][1]['action_name']).to eq('sent')
      expect(json['data']['timelines'][2]['action_name']).to eq('created')
    end

    it 'should get events with pagination and time range', rpdoc_example_key: 200_2, rpdoc_example_name: 'get timelines of member success (with page and time range)' do
      mock_current_time(3.days.ago)
      FactoryBot.create(:completed_task1)
      mock_current_time(1.days.ago)
      FactoryBot.create(:completed_task2)
      FactoryBot.create(:completed_task3)
      params = {
        page: 3,
        per_page: 1,
        start_from: 2.days.ago.strftime('%Y-%m-%d'),
        end_at: Time.now.strftime('%Y-%m-%d'),
      }
      get "#{@path}?#{URI.encode_www_form(params)}", headers: @headers
      expect(json['data']['timelines'].count).to eq(1)
      expect(json['data']['current_page']).to eq(3)
      expect(json['data']['total_pages']).to eq(4)
    end

    it 'should return 400003 if invalid member', rpdoc_example_key: 400003, rpdoc_example_name: 'get timelines of member failed (invalid member)', skip_auth: true do
      @headers['Authorization'] = 'Bearer invalid-token'
      get @path, headers: @headers
      expect(response).to have_http_status(400)
      expect(json['error_code']).to eq(400003)
      expect(json['error_key']).to eq('invalid_member')
    end
  end
end
