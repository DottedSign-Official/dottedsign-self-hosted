# frozen_string_literal: true
require 'rails_helper'

RSpec.describe Api::V1::PublicForms::FormTasksController, type: :request do
  include_context 'rpdoc'

  before(:each) do |example|
    example.metadata[:rpdoc_action_key] = 'index'
    example.metadata[:rpdoc_action_name] = '取得公開表單任務列表'
    example.metadata[:rpdoc_example_folders] = ['v1', 'public_forms', 'form_tasks']

    mock_member(:member_me, skip_auth: example.metadata[:skip_auth])
    FactoryBot.create(:waiting_for_me_form_task)

    mock_headers(http_method: :get)
    @path = '/api/v1/public_forms/form_tasks'
  end

  describe '#index' do
    it 'should get 1 form task waiting for me from 4 form tasks related to me', rpdoc_example_key: 200, rpdoc_example_name: 'list waiting for me form tasks success' do
      FactoryBot.create(:waiting_form_task)
      FactoryBot.create(:waiting_for_me1)
      FactoryBot.create(:completed_form_task)
      get "#{@path}?#{URI.encode_www_form({ category: 'waiting_for_me' })}", headers: @headers
      expect(json['data']['tasks'].length).to eq(1)
      expect(json['data']['summary']['waiting_for_me']).to eq(1)
      expect(json['data']['summary']['completed']).to eq(1)
    end

    it 'should get the second page', rpdoc_example_key: 200_2, rpdoc_example_name: 'list completed tasks success (page 2)' do
      FactoryBot.create_list(:completed_form_task, 3)
      params = {
        category: 'completed',
        page: 2,
        per_page: 2
      }
      get "#{@path}?#{URI.encode_www_form(params)}", headers: @headers
      expect(json['data']['tasks'].length).to eq(1)
      expect(json['data']['current_page']).to eq(2)
      expect(json['data']['total_pages']).to eq(2)
    end

    it 'should return 200 and get form tasks by search keys(file_name)', rpdoc_example_key: 200_3, rpdoc_example_name: 'list form tasks success (list matched terms form tasks)' do
      FactoryBot.create(:completed_form_task)
      params = {
        category: 'waiting_for_me',
        terms: "a"
      }
      get "#{@path}?#{URI.encode_www_form(params)}", headers: @headers
      expect(json['data']['tasks'].length).to eq(1)
      expect(json['data']['summary']['waiting_for_me']).to eq(1)
      expect(json['data']['summary']['completed']).to eq(1)
    end

    it 'should return 400036 if category not allowed', rpdoc_example_key: 400036, rpdoc_example_name: 'list form tasks failed (category not allowed)' do
      get "#{@path}?#{URI.encode_www_form({ category: 'invalid_category' })}", headers: @headers
      expect(response).to have_http_status(400)
      expect(json['error_code']).to eq(400036)
      expect(json['error_key']).to eq('category_not_allow')
    end

    it 'should return 400003 if invalid member', rpdoc_example_key: 400003, rpdoc_example_name: 'list form tasks failed (invalid member)', skip_auth: true do
      @headers['Authorization'] = 'Bearer invalid-token'
      get @path, headers: @headers
      expect(response).to have_http_status(400)
      expect(json['error_code']).to eq(400003)
      expect(json['error_key']).to eq('invalid_member')
    end
  end
end
