require 'rails_helper'

RSpec.describe Api::V1::SignTasksController, type: :request do
  include_context 'rpdoc'

  before(:each) do |example|
    example.metadata[:rpdoc_action_key] = 'index'
    example.metadata[:rpdoc_action_name] = 'list tasks'
    example.metadata[:rpdoc_example_folders] = ['v1', 'sign_tasks']

    mock_headers(http_method: :get)
    @member = mock_member(:member_me, skip_auth: example.metadata[:skip_auth])
    @path = '/api/v1/sign_tasks'
  end

  describe '#index' do
    before(:each) do
      @params = { category: 'completed' }
    end

    it 'should return 200', rpdoc_example_key: 200_1, rpdoc_example_name: 'list completed tasks success' do
      get "#{@path}?#{URI.encode_www_form(@params)}", headers: @headers
      expect(response).to have_http_status(200)
    end

    it 'should get tasks related to me', rpdoc_example_key: 200_2, rpdoc_example_name: 'list waiting tasks success (waiting for me)' do
      FactoryBot.create(:waiting_for_me1)
      FactoryBot.create(:waiting_for_me1, :form_type)
      FactoryBot.create(:waiting_for_me_envelope)
      FactoryBot.create(:not_related)
      FactoryBot.create(:not_related_envelope)
      @params[:category] = 'waiting_for_me'
      get "#{@path}?#{URI.encode_www_form(@params)}", headers: @headers
      expect(json['data']['tasks'].length).to eq(2)
    end

    it 'should get 2 tasks waiting for me from 4 tasks related to me', rpdoc_example_key: 200_3, rpdoc_example_name: 'list waiting tasks success (waiting for me)' do
      FactoryBot.create(:waiting_for_me1)
      FactoryBot.create(:waiting_for_me_envelope)
      FactoryBot.create(:completed_task1)
      FactoryBot.create(:completed_envelope)
      @params[:category] = 'waiting_for_me'
      get "#{@path}?#{URI.encode_www_form(@params)}", headers: @headers
      expect(json['data']['tasks'].length).to eq(2)
      expect(json['data']['summary']['waiting_for_me']).to eq(2)
      expect(json['data']['summary']['completed']).to eq(2)
    end

    it 'should get 2 tasks waiting for others from 4 tasks related to me', rpdoc_example_key: 200_4, rpdoc_example_name: 'list waiting tasks success (waiting for others)' do
      FactoryBot.create(:waiting_for_me1)
      FactoryBot.create(:waiting_for_me_envelope)
      FactoryBot.create(:waiting_for_others1)
      FactoryBot.create(:waiting_for_others_envelope)
      @params[:category] = 'waiting_for_others'
      get "#{@path}?#{URI.encode_www_form(@params)}", headers: @headers
      expect(json['data']['tasks'].length).to eq(2)
      expect(json['data']['summary']['waiting_for_me']).to eq(2)
      expect(json['data']['summary']['waiting_for_others']).to eq(2)
    end

    it 'should get 3 completed tasks from 5 tasks related to me', rpdoc_example_key: 200_5, rpdoc_example_name: 'list completed tasks success (page 1)' do
      FactoryBot.create(:waiting_for_me1)
      FactoryBot.create(:waiting_for_me_envelope)
      FactoryBot.create(:completed_task1)
      FactoryBot.create(:completed_task2)
      FactoryBot.create(:completed_envelope)
      get "#{@path}?#{URI.encode_www_form(@params)}", headers: @headers
      expect(json['data']['tasks'].length).to eq(3)
      expect(json['data']['summary']['waiting_for_me']).to eq(2)
      expect(json['data']['summary']['completed']).to eq(3)
    end

    it 'should get 2 draft tasks from 4 tasks related to me', rpdoc_example_key: 200_6, rpdoc_example_name: 'list draft tasks success (page 2)' do
      FactoryBot.create(:draft_task)
      FactoryBot.create(:draft_envelope)
      FactoryBot.create(:completed_task1)
      FactoryBot.create(:completed_envelope)
      @params[:category] = 'draft'
      get "#{@path}?#{URI.encode_www_form(@params)}", headers: @headers
      expect(json['data']['tasks'].length).to eq(2)
      expect(json['data']['summary']['draft']).to eq(2)
      expect(json['data']['summary']['completed']).to eq(2)
    end

    it 'should get 3 canceled tasks from 5 tasks related to me', rpdoc_example_key: 200_7, rpdoc_example_name: 'list draft tasks success (page 2)' do
      FactoryBot.create(:draft_task)
      FactoryBot.create(:draft_envelope)
      FactoryBot.create(:declined_task1)
      FactoryBot.create(:declined_envelope)
      expired_task = FactoryBot.create(:expired_task1)
      expired_task.sign_events.last.update(task_expired: true)
      @params[:category] = 'canceled'
      get "#{@path}?#{URI.encode_www_form(@params)}", headers: @headers
      expect(json['data']['tasks'].length).to eq(3)
      expect(json['data']['summary']['draft']).to eq(2)
      expect(json['data']['summary']['canceled']).to eq(3)
    end
    
    it 'should get 1 task waiting, 1 reissue for me and completed task from 3 tasks related to me', rpdoc_example_key: 200_3, rpdoc_example_name: 'list waiting tasks success (waiting for me)' do
      FactoryBot.create(:reissue_for_me1)
      FactoryBot.create(:waiting_for_me1)
      FactoryBot.create(:completed_task1)
      @params[:category] = 'reissue_for_me'
      get "#{@path}?#{URI.encode_www_form(@params)}", headers: @headers
      expect(json['data']['tasks'].length).to eq(1)
      expect(json['data']['summary']['waiting_for_me']).to eq(1)
      expect(json['data']['summary']['completed']).to eq(1)
      expect(json['data']['summary']['reissue_for_me']).to eq(1)
    end

    it 'should get the second page', rpdoc_example_key: 200_7, rpdoc_example_name: 'list completed tasks success (page 2)' do
      FactoryBot.create(:completed_task1)
      FactoryBot.create(:completed_envelope)
      FactoryBot.create(:completed_task2)
      FactoryBot.create(:completed_task3)
      @params[:page] = 2
      @params[:per_page] = 2
      get "#{@path}?#{URI.encode_www_form(@params)}", headers: @headers
      expect(json['data']['tasks'].length).to eq(2)
      expect(json['data']['current_page']).to eq(2)
      expect(json['data']['total_pages']).to eq(2)
    end

    it 'should get tasks with tags', rpdoc_skip: true do
      task = FactoryBot.create(:completed_task1)
      envelope = FactoryBot.create(:completed_envelope)
      origin_tags = ['Tag 1', 'Tag 2']
      @member.tag(task, with: origin_tags, on: :tags)
      @member.tag(envelope, with: origin_tags, on: :tags)
      @params[:page] = 1
      @params[:per_page] = 2
      get "#{@path}?#{URI.encode_www_form(@params)}", headers: @headers
      expect(json['data']['tasks'].length).to eq(2)
      expect(json['data']['current_page']).to eq(1)
      expect(json['data']['total_pages']).to eq(1)
    end

    it 'should return 400036 if category not allowed', rpdoc_example_key: 400036, rpdoc_example_name: 'list tasks failed (category not allowed)' do
      @params[:category] = 'fake_category'
      get "#{@path}?#{URI.encode_www_form(@params)}", headers: @headers
      expect(response).to have_http_status(400)
      expect(json['error_code']).to eq(400036)
      expect(json['error_key']).to eq('category_not_allow')
    end

    it 'should return 400003 if invalid member', rpdoc_example_key: 400003, rpdoc_example_name: 'list tasks failed (invalid member)', skip_auth: true do
      @headers['Authorization'] = 'Bearer invalid-token'
      get "#{@path}?#{URI.encode_www_form(@params)}", headers: @headers
      expect(response).to have_http_status(400)
      expect(json['error_code']).to eq(400003)
      expect(json['error_key']).to eq('invalid_member')
    end
  end
end
