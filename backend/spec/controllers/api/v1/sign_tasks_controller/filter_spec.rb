require 'rails_helper'

RSpec.describe Api::V1::SignTasksController, type: :request do
  include_context 'rpdoc'

  before(:each) do |example|
    example.metadata[:rpdoc_action_key] = 'filter'
    example.metadata[:rpdoc_action_name] = 'filter tasks'
    example.metadata[:rpdoc_example_folders] = ['v1', 'sign_tasks']

    @member = mock_member(:member_me, skip_auth: example.metadata[:skip_auth])
    @headers = {
      'Authorization' => 'Bearer {{rabbit_token}}'
    }
    @path = '/api/v1/sign_tasks/filter'
  end

  describe '#filter' do
    before(:each) do
      @params = {
        category: 'waiting_for_me',
        filter: 'expire_soon'
      }
    end

    it 'should return 200 with expire soon and waiting for me tasks', rpdoc_example_key: 200, rpdoc_example_name: 'filter tasks success' do
      FactoryBot.create(:waiting_for_me1)
      FactoryBot.create(:waiting_for_me2)
      FactoryBot.create(:waiting_for_others1)
      FactoryBot.create(:completed_task1)
      FactoryBot.create(:expired_task1)
      get "#{@path}?#{URI.encode_www_form(@params)}", headers: @headers
      expect(response).to have_http_status(200)
      expect(json['data']['tasks'])
    end

    it 'should return 400036 if category is not allowed', rpdoc_example_key: 400003, rpdoc_example_name: 'filter tasks failed (category not allowed)' do
      @params[:category] = 'not_allow_category'
      get "#{@path}?#{URI.encode_www_form(@params)}", headers: @headers
      expect(response).to have_http_status(400)
      expect(json['error_code']).to eq(400036)
    end

    it 'should return 400042 if filter is not allowed', rpdoc_example_key: 400003, rpdoc_example_name: 'filter tasks failed (filter not allowed)' do
      @params[:filter] = 'not_allow_filter'
      get "#{@path}?#{URI.encode_www_form(@params)}", headers: @headers
      expect(response).to have_http_status(400)
      expect(json['error_code']).to eq(400042)
    end

    it 'should return 400003 if invalid member', rpdoc_example_key: 400003, rpdoc_example_name: 'filter tasks failed (invalid member)', skip_auth: true do
      @headers['Authorization'] = 'Bearer invalid-token'
      get "#{@path}?#{URI.encode_www_form(@params)}", headers: @headers
      expect(response).to have_http_status(400)
      expect(json['error_code']).to eq(400003)
      expect(json['error_key']).to eq('invalid_member')
    end
  end
end
