require 'rails_helper'

RSpec.describe Api::V1::SignTasks::BulkController, type: :request do
  include_context 'rpdoc'

  before(:each) do |example|
    example.metadata[:rpdoc_action_key] = 'sample'
    example.metadata[:rpdoc_action_name] = 'download bulk mission sample'
    example.metadata[:rpdoc_example_folders] = ['v1', 'sign_tasks', 'bulk']

    build_test_members
    @member = mock_member(:member_me, skip_auth: example.metadata[:skip_auth])
    @headers = {'Authorization' => 'Bearer {{rabbit_token}}'}
    @path = '/api/v1/sign_tasks/bulk/sample'
    mock_download('text/csv')
    @template = FactoryBot.create(:template, owner: @member)
  end

  describe '#sample' do
    before(:each) do
      @params = {
        template_id: @template.id
      }
    end

    it 'should return 200 and get sample file', rpdoc_example_key: 200, rpdoc_example_name: 'download bulk mission sample success' do
      get "#{@path}?#{URI.encode_www_form(@params)}", headers: @headers
      expect(response).to have_http_status(200)
      expect(response.headers['Content-Type']).to include('text/csv')
      expect(response.headers['Content-Disposition']).to include('attachment')
      expect(response.headers['Content-Disposition']).to include("template_#{@template.id}_sample")
    end

    it 'should return 404035 if template is not found', rpdoc_example_key: 404035, rpdoc_example_name: 'download bulk mission sample failed (template not found)' do
      @params[:template_id] = 0
      get "#{@path}?#{URI.encode_www_form(@params)}", headers: @headers
      expect(response).to have_http_status(404)
      expect(json['error_code']).to eq(404035)
    end

    it 'should return 400053 if template is deleted', rpdoc_example_key: 400053, rpdoc_example_name: 'download bulk mission sample failed (template deleted)' do
      @template.deleted!
      get "#{@path}?#{URI.encode_www_form(@params)}", headers: @headers
      expect(response).to have_http_status(400)
      expect(json['error_code']).to eq(400053)
    end

    it 'should return 403044 if template is not accessible', rpdoc_example_key: 403044, rpdoc_example_name: 'download bulk mission sample failed (template not accessible)' do
      other_template = FactoryBot.create(:template, owner: @ada)
      @params[:template_id] = other_template.id
      get "#{@path}?#{URI.encode_www_form(@params)}", headers: @headers
      expect(response).to have_http_status(403)
      expect(json['error_code']).to eq(403044)
    end

    it 'should return 400003 if invalid member', rpdoc_example_key: 400003, rpdoc_example_name: 'download bulk mission sample failed (invalid member)', skip_auth: true do
      @headers['Authorization'] = 'Bearer invalid-token'
      get "#{@path}?#{URI.encode_www_form(@params)}", headers: @headers
      expect(response).to have_http_status(400)
      expect(json['error_code']).to eq(400003)
      expect(json['error_key']).to eq('invalid_member')
    end

    it 'should return 400_925 if template has invalid stage action', rpdoc_example_key: 400003, rpdoc_example_name: 'download bulk mission sample failed (template has invalid stage action)' do
      template = FactoryBot.create(:template, owner: @member, with_review_stage: true)
      @params[:template_id] = template.id
      get "#{@path}?#{URI.encode_www_form(@params)}", headers: @headers
      expect(response).to have_http_status(400)
      expect(json['error_code']).to eq(400_925)
      expect(json['error_key']).to eq('template_with_invalid_stage_action')
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
