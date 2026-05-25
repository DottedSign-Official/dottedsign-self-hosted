require 'rails_helper'

RSpec.describe Api::V1::SignTasks::SearchController, type: :request do
  include_context 'rpdoc'

  before(:each) do |example|
    example.metadata[:rpdoc_action_key] = 'search'
    example.metadata[:rpdoc_action_name] = 'search tasks'
    example.metadata[:rpdoc_example_folders] = ['v1', 'sign_tasks', 'search']

    @member = mock_member(:member_me, skip_auth: example.metadata[:skip_auth])
    @headers = {'Authorization' => 'Bearer {{rabbit_token}}'}
    @path = '/api/v1/sign_tasks/search'
  end

  describe '#search' do

    it 'should return 200 if search success', rpdoc_skip: true do
      get @path, headers: @headers
      expect(response).to have_http_status(200)
    end

    it 'should get 2 owner by me', rpdoc_skip: true do
      FactoryBot.create(:waiting_for_others1)
      FactoryBot.create(:waiting_for_others_envelope)
      get @path, headers: @headers
      expect(response).to have_http_status(200)
      expect(json['data']['total_count']).to eq(2)
    end

    it 'should get 2 signer by me', rpdoc_skip: true do
      FactoryBot.create(:waiting_for_me2)
      FactoryBot.create(:waiting_for_me_envelope2)
      get @path, headers: @headers
      expect(response).to have_http_status(200)
      expect(json['data']['total_count']).to eq(2)
    end

    it 'should get 0 neither owner by me nor signer by me', rpdoc_skip: true do
      FactoryBot.create(:not_related)
      FactoryBot.create(:not_related_envelope)
      get @path, headers: @headers
      expect(response).to have_http_status(200)
      expect(json['data']['total_count']).to eq(0)
    end

    it 'should get 2 for search related document', rpdoc_skip: true do
      task = FactoryBot.create(:waiting_for_others1)
      FactoryBot.create(:waiting_for_others_envelope)
      params = {
        target: 'document',
        terms: task.file_name
      }
      get "#{@path}?#{URI.encode_www_form(params)}", headers: @headers
      expect(json['data']['total_count']).to eq(2)
    end

    it 'should get 0 for search related document not found', rpdoc_skip: true do
      FactoryBot.create(:not_related)
      FactoryBot.create(:not_related_envelope)
      params = {
        target: 'document',
        terms: 'abc.pdf'
      }
      get "#{@path}?#{URI.encode_www_form(params)}", headers: @headers
      expect(json['data']['total_count']).to eq(0)
    end

    it 'should get 2 for search related recipient', rpdoc_skip: true do
      task = FactoryBot.create(:waiting_for_others1)
      FactoryBot.create(:waiting_for_others_envelope)
      params = {
        target: 'recipient',
        terms: task.owner.email
      }
      get "#{@path}?#{URI.encode_www_form(params)}", headers: @headers
      expect(json['data']['total_count']).to eq(2)
    end

    it 'should get 0 for search related recipient not found', rpdoc_skip: true do
      FactoryBot.create(:not_related)
      FactoryBot.create(:not_related_envelope)
      params = {
        target: 'recipient',
        terms: 'xyz@test.com'
      }
      get "#{@path}?#{URI.encode_www_form(params)}", headers: @headers
      expect(json['data']['total_count']).to eq(0)
    end

    it 'should get 2 for search between date range', rpdoc_skip: true do
      FactoryBot.create(:waiting_for_others1)
      FactoryBot.create(:waiting_for_others_envelope)
      params = {
        start_from: 1.day.ago,
        end_at: 1.day.after
      }
      get "#{@path}?#{URI.encode_www_form(params)}", headers: @headers
      expect(json['data']['total_count']).to eq(2)
    end

    it 'should get 0 for search not between date range', rpdoc_skip: true do
      FactoryBot.create(:waiting_for_others1)
      FactoryBot.create(:waiting_for_others_envelope)
      params = {
        start_from: 1.day.after,
        end_at: 2.day.after
      }
      get "#{@path}?#{URI.encode_www_form(params)}", headers: @headers
      expect(json['data']['total_count']).to eq(0)
    end

    it 'should get the 2nd page with 6 total pages', rpdoc_example_key: 200, rpdoc_example_name: 'search tasks success' do
      FactoryBot.create(:waiting_for_me1)
      FactoryBot.create(:waiting_for_me2)
      FactoryBot.create(:waiting_for_me_envelope)
      FactoryBot.create(:waiting_for_me_envelope2)
      FactoryBot.create(:waiting_for_others1)
      FactoryBot.create(:waiting_for_others_envelope)
      params = {
        page: 2,
        per_page: 2
      }
      get "#{@path}?#{URI.encode_www_form(params)}", headers: @headers
      expect(json['data']['current_page']).to eq(2)
      expect(json['data']['total_pages']).to eq(3)
    end

    it 'should return 200 if search with tags success', rpdoc_example_key: 200_2, rpdoc_example_name: 'search tasks with tags success' do
      task = FactoryBot.create(:sign_task, owner: @member)
      envelope = FactoryBot.create(:waiting_for_me_envelope)
      tag_1_2 = ['Tag 1', 'Tag 2']
      tag_1_3 = ['Tag 1', 'Tag 3']
      @member.tag(task, with: tag_1_2, on: :tags)
      @member.tag(envelope, with: tag_1_3, on: :tags)
      params = { search_tags: ['Tag 1'] }
      get "#{@path}?#{URI.encode_www_form(params)}", headers: @headers
      expect(response).to have_http_status(200)
      expect(json['data']['tasks'][0]['envelope_id']).to eq(envelope.id)
      expect(json['data']['tasks'][0]['tag_info'][tag_1_3[0]]).to be_truthy
      expect(json['data']['tasks'][0]['tag_info'][tag_1_3[1]]).to be_truthy
      expect(json['data']['tasks'][1]['task_id']).to eq(task.id)
      expect(json['data']['tasks'][1]['tag_info'][tag_1_2[0]]).to be_truthy
      expect(json['data']['tasks'][1]['tag_info'][tag_1_2[1]]).to be_truthy
    end

    it 'should return 400003 if invalid member', rpdoc_example_key: 400003, rpdoc_example_name: 'search tasks failed (invalid member)', skip_auth: true do
      @headers['Authorization'] = 'Bearer invalid-token'
      params = {page: 1}
      get "#{@path}?#{URI.encode_www_form(params)}", headers: @headers
      expect(response).to have_http_status(400)
      expect(json['error_code']).to eq(400003)
      expect(json['error_key']).to eq('invalid_member')
    end
  end
end
