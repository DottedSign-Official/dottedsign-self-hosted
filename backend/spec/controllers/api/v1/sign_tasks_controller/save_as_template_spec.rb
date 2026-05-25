require 'rails_helper'

RSpec.describe Api::V1::SignTasksController, type: :request do
  include_context 'rpdoc'

  before(:each) do |example|
    example.metadata[:rpdoc_action_key] = 'save_as_template'
    example.metadata[:rpdoc_action_name] = 'save task as template'
    example.metadata[:rpdoc_example_folders] = ['v1', 'sign_tasks']

    mock_upload
    @member = mock_member(:member_me, skip_auth: example.metadata[:skip_auth])
    @task = FactoryBot.create(:completed_task4)

    @headers = {
      'Content-Type' => 'application/json',
      'Authorization' => 'Bearer {{rabbit_token}}'
    }
    @path = '/api/v1/sign_tasks/save_as_template'
    @params = {
      sign_task_id: @task.id,
      template_name: 'Test Template'
    }
  end

  describe '#save_as_template' do
    it 'should return 200 and create template successfully', rpdoc_example_key: 200, rpdoc_example_name: 'save task as template success' do
      expect {
        post @path, params: @params.to_json, headers: @headers
      }.to change(Template, :count).by(1)

      expect(response).to have_http_status(200)
      expect(json['data']['template_name']).to eq(@params[:template_name])
      expect(json['data']['template_id']).to be_present
      expect(json['data']['created_at']).to be_present

      new_template = Template.find(json['data']['template_id'])
      expect(new_template.file_name).to eq(@params[:template_name])
      expect(new_template.owner_id).to eq(@member.id)
      expect(new_template.has_order).to eq(@task.has_order)
      expect(new_template.status).to eq('active')
      expect(new_template.dummy_stages.count).to eq(@task.stages.count)
      expect(new_template.template_setting.forget_remind).to eq(@task.task_setting.forget_remind)
      expect(new_template.template_setting.receiver_lang).to eq(@task.task_setting.receiver_lang)

      template_stage = new_template.dummy_stages.first
      task_stage = @task.stages.first
      expect(template_stage.attachment_setting.length).to eq(task_stage.attachment_setting.length)
      expect(template_stage.verify_methods.count).to eq(task_stage.verify_methods.count)

      source_field_count = @task.stages.sum { |stage| stage.field_settings.count }
      new_field_count = new_template.dummy_stages.sum { |stage| stage.field_settings.count }
      expect(new_field_count).to eq(source_field_count)
    end

    it 'should return 200 and use default template name', rpdoc_example_key: 200_2, rpdoc_example_name: 'save task as template success (default name)' do
      @params.delete(:template_name)
      post @path, params: @params.to_json, headers: @headers
      expect(response).to have_http_status(200)
      expect(json['data']['template_name']).to eq("#{@task.file_name} copy")
    end

    it 'should return 200 if task is waiting', rpdoc_example_key: 200_3, rpdoc_example_name: 'save as template success (waiting task)' do |example|
      task = FactoryBot.create(:waiting_for_me_with_field_groups)
      @params[:sign_task_id] = task.id
      post(@path, params: @params.to_json, headers: @headers)
      expect(response).to have_http_status(200)
      expect(json['data']['template_name']).to eq(@params[:template_name])

      template = Template.find(json['data']['template_id'])
      expect(template.stages.length).to eq(task.stages.length)
      expect(template.field_settings.length).to eq(task.field_settings.length)
      expect(template.field_setting_groups.length).to eq(task.field_setting_groups.length)
    end

    it 'should return 404031 if task not found', rpdoc_example_key: 404031, rpdoc_example_name: 'save as template failed (task not found)' do
      @params[:sign_task_id] = 999999
      post @path, params: @params.to_json, headers: @headers
      expect(response).to have_http_status(404)
      expect(json['error_code']).to eq(404031)
      expect(json['error_key']).to eq('task_not_found')
    end

    it 'should return 403069 if task is draft', rpdoc_example_key: 403069, rpdoc_example_name: 'save as template failed (task is draft)' do
      @task.update!(status: 'draft')
      post @path, params: @params.to_json, headers: @headers
      expect(response).to have_http_status(403)
      expect(json['error_code']).to eq(403069)
      expect(json['error_key']).to eq('task_is_draft')
    end

    it 'should return 400003 if invalid member', rpdoc_example_key: 400003, rpdoc_example_name: 'save as template failed (invalid member)', skip_auth: true do
      @headers['Authorization'] = 'Bearer invalid-token'
      post @path, params: @params.to_json, headers: @headers
      expect(response).to have_http_status(400)
      expect(json['error_code']).to eq(400003)
      expect(json['error_key']).to eq('invalid_member')
    end
  end
end
