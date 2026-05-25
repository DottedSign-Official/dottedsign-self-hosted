require 'rails_helper'

RSpec.describe Api::V1::SignTasks::BulkController, type: :request do
  include_context 'rpdoc'

  before(:each) do |example|
    example.metadata[:rpdoc_action_key] = 'create_mission'
    example.metadata[:rpdoc_action_name] = 'create bulk mission'
    example.metadata[:rpdoc_example_folders] = ['v1', 'sign_tasks', 'bulk']

    build_test_members
    @member = mock_member(:member_me, skip_auth: example.metadata[:skip_auth])
    @headers = {
      'Content-Type' => 'application/json',
      'Authorization' => 'Bearer {{rabbit_token}}'
    }
    @path = '/api/v1/sign_tasks/bulk/create_mission'
  end

  describe '#create_mission' do
    before(:each) do
      @template = FactoryBot.create(:template, owner: @member, dummy_stage_count: 2)
      @params = {
        template_id: @template.id,
        tasks: [
          {
            file_name: 'Task 1',
            stages: [
              {email: @ada.email, name: @ada.name},
              {email: @bella.email, name: @bella.name}
            ]
          },
          {
            file_name: 'Task 2',
            stages: [
              {email: @bella.email, name: @bella.name},
              {email: @ada.email, name: @ada.name}
            ]
          }
        ]
      }
    end

    it 'should return 200 and get mission info', rpdoc_example_key: 200, rpdoc_example_name: 'create bulk mission success' do
      mock_worker(BulkSendWorker)
      post @path, params: @params.to_json, headers: @headers
      expect(response).to have_http_status(200)
      expect(json['data']).to have_key('bulk_uuid')
      expect(json['data']['bulk_count']).to eq(@params[:tasks].count)
    end

    it 'should return 404035 if template is not found', rpdoc_example_key: 404035, rpdoc_example_name: 'create bulk mission failed (template not found)' do
      @params[:template_id] = 0
      post @path, params: @params.to_json, headers: @headers
      expect(response).to have_http_status(404)
      expect(json['error_code']).to eq(404035)
    end

    it 'should return 400053 if template is deleted', rpdoc_example_key: 400053, rpdoc_example_name: 'create bulk mission failed (template deleted)' do
      @template.deleted!
      @params[:template_id] = @template.id
      post @path, params: @params.to_json, headers: @headers
      expect(response).to have_http_status(400)
      expect(json['error_code']).to eq(400053)
    end

    it 'should return 403044 if template is not accessible', rpdoc_example_key: 403044, rpdoc_example_name: 'create bulk mission failed (template not accessible)' do
      other_template = FactoryBot.create(:template, owner: @ada)
      @params[:template_id] = other_template.id
      post @path, params: @params.to_json, headers: @headers
      expect(response).to have_http_status(403)
      expect(json['error_code']).to eq(403044)
    end

    it 'should return 400003 if invalid member', rpdoc_example_key: 400003, rpdoc_example_name: 'create bulk mission failed (invalid member)', skip_auth: true do
      @headers['Authorization'] = 'Bearer invalid-token'
      post @path, params: @params.to_json, headers: @headers
      expect(response).to have_http_status(400)
      expect(json['error_code']).to eq(400003)
      expect(json['error_key']).to eq('invalid_member')
    end

    context '>> in group' do
      before(:each) do
        FactoryBot.create(:group_member)
        mock_group(@member)
      end

      include_examples 'group_allow_examples', 'post', 'bulk_send', 'self_sender', 200_01
      include_examples 'group_forbid_examples', 'post', 'bulk_send', 'self_sender', 403036_01
    end
  end
end
