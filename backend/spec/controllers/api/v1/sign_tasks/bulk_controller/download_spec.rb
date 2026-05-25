require 'rails_helper'

RSpec.describe Api::V1::SignTasks::BulkController, type: :request do
  include_context 'rpdoc'

  before(:each) do |example|
    example.metadata[:rpdoc_action_key] = 'download'
    example.metadata[:rpdoc_action_name] = 'download bulk mission tasks'
    example.metadata[:rpdoc_example_folders] = ['v1', 'sign_tasks', 'bulk']

    build_test_members
    @member = mock_member(:member_me, skip_auth: example.metadata[:skip_auth])
    @headers = {'Authorization' => 'Bearer {{rabbit_token}}'}
    @path = '/api/v1/sign_tasks/bulk/download'
    mock_download('application/zip')
  end

  describe '#download' do

    it 'should return 200 and get download file', rpdoc_example_key: 200, rpdoc_example_name: 'download bulk mission tasks success' do
      mission = FactoryBot.create(:completed_mission)
      params = {mission_uuid: mission.uuid}
      get "#{@path}?#{URI.encode_www_form(params)}", headers: @headers
      expect(response).to have_http_status(200)
      expect(response.headers['Content-Type']).to eq('application/zip')
      expect(response.headers['Content-Disposition']).to include('attachment')
      expect(response.headers['Content-Disposition']).to include("compress.zip")
    end

    it 'should return 404040 if mission is not found', rpdoc_example_key: 404040, rpdoc_example_name: 'download bulk mission tasks failed (mission not found)' do
      params = {mission_uuid: 'not-exist-uuid'}
      get "#{@path}?#{URI.encode_www_form(params)}", headers: @headers
      expect(response).to have_http_status(404)
      expect(json['error_code']).to eq(404040)
    end

    it 'should return 400059 if mission is not ready', rpdoc_example_key: 400059, rpdoc_example_name: 'download bulk mission tasks failed (mission not ready)' do
      mission = FactoryBot.create(:processing_mission)
      params = {mission_uuid: mission.uuid}
      get "#{@path}?#{URI.encode_www_form(params)}", headers: @headers
      expect(response).to have_http_status(400)
      expect(json['error_code']).to eq(400059)
    end

    it 'should return 403046 if member has no bulk send permission', rpdoc_example_key: 403046_1, rpdoc_example_name: 'download bulk mission tasks failed (member has no bulk send permission)' do
      member = mock_member(:member_a)
      mission = FactoryBot.create(:completed_mission)
      params = {mission_uuid: mission.uuid}
      get "#{@path}?#{URI.encode_www_form(params)}", headers: @headers
      expect(response).to have_http_status(403)
      expect(json['error_code']).to eq(403046)
    end

    it 'should return 400003 if invalid member', rpdoc_example_key: 400003, rpdoc_example_name: 'download bulk mission tasks failed (invalid member)', skip_auth: true do
      @headers['Authorization'] = 'Bearer invalid-token'
      params = {mission_uuid: 'uuid'}
      get "#{@path}?#{URI.encode_www_form(params)}", headers: @headers
      expect(response).to have_http_status(400)
      expect(json['error_code']).to eq(400003)
      expect(json['error_key']).to eq('invalid_member')
    end

    context '>> in group' do
      before(:each) do
        FactoryBot.create(:group_member)
        mock_group(@member)
        mission = FactoryBot.create(:completed_mission)
        @params = {mission_uuid: mission.uuid}
      end

      include_examples 'group_allow_examples', 'get', 'bulk_send', 'self_sender', 200_01
      include_examples 'group_forbid_examples', 'get', 'bulk_send', 'self_sender', 403036_01
    end
  end
end
