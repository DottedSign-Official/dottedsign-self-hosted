require 'rails_helper'

RSpec.describe Api::V1::SignTasks::KioskController, type: :request do
  include_context 'rpdoc'

  before(:each) do |example|
    example.metadata[:rpdoc_action_key] = 'create'
    example.metadata[:rpdoc_action_name] = '建立臨櫃簽署任務'
    example.metadata[:rpdoc_example_folders] = ['v1', 'sign_tasks', 'kiosk']

    mock_upload
    @member = mock_member(:member_me)
    @headers = {
      'Authorization' => 'Bearer token',
      'Content-Type' => 'application/json'
    }
    @path = '/api/v1/sign_tasks/kiosk'
    @template = FactoryBot.create(:template, owner: @member)
  end

  describe '#create' do
    before(:each) do
      stages = @template.dummy_stages.map.with_index do |stage, index|
        {
          role: "A_#{index}",
          others: {
            requisite: {
              name: 'optional',
              email: 'required',
              phone: 'disabled'
            },
            informable: index.even?
          }
        }
      end

      @params = {
        template_id: @template.id,
        file_name: 'Kiosk Task',
        stages: stages,
        client: 'web',
        ip_address: '211.22.240.100'
      }
    end

    it 'should return 200', rpdoc_example_key: 200, rpdoc_example_name: 'create kiosk task success' do
      post @path, params: @params.to_json, headers: @headers
      expect(response).to have_http_status(200)
      task = SignTask.last
      expect(task.kiosk?).to be(true)
      expect(task.waiting?).to be(true)
      expect(task.dummy_stages.first.processing?).to be(true)
    end

    it 'should create kiosk task', rpdoc_skip: true do
      expect{post @path, params: @params.to_json, headers: @headers}.to change{SignTask.count}.by(1)
    end

    it 'should return 403044 if template not accessible', rpdoc_example_key: 403044, rpdoc_example_name: 'create kiosk task failed (template not accessible)' do
      member = FactoryBot.create(:member_a)
      @template.update(owner_id: member.id)
      post @path, params: @params.to_json, headers: @headers
      expect(response).to have_http_status(403)
      expect(json['error_code']).to eq(403044)
      expect(json['error_key']).to eq('template_not_accessible')
    end

    it 'should return 400902 if template not order', rpdoc_example_key: 400902, rpdoc_example_name: 'create kiosk task failed (template not order)' do
      @template.update(has_order: false)
      post @path, params: @params.to_json, headers: @headers
      expect(response).to have_http_status(400)
      expect(json['error_code']).to eq(400902)
      expect(json['error_key']).to eq('template_need_order')
    end

    it 'should return 400053 if template deleted', rpdoc_example_key: 400053, rpdoc_example_name: 'create kiosk task failed (template deleted)' do
      @template.deleted!
      post @path, params: @params.to_json, headers: @headers
      expect(response).to have_http_status(400)
      expect(json['error_code']).to eq(400053)
      expect(json['error_key']).to eq('template_deleted')
    end

    it 'should return 400417 if template has review stage', rpdoc_example_key: 400417, rpdoc_example_name: 'create kiosk task failed (template has review stage)' do
      template = FactoryBot.create(:template, owner: @member, with_review_stage: true)
      @params[:template_id] = template.id
      post @path, params: @params.to_json, headers: @headers
      expect(response).to have_http_status(400)
      expect(json['error_code']).to eq(400417)
      expect(json['error_key']).to eq('invalid_params')
    end
  end

end
