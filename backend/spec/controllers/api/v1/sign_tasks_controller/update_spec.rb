require 'rails_helper'

RSpec.describe Api::V1::SignTasksController, type: :request do
  include_context 'rpdoc'

  before(:each) do |example|
    example.metadata[:rpdoc_action_key] = 'update'
    example.metadata[:rpdoc_action_name] = 'update task'
    example.metadata[:rpdoc_example_folders] = ['v1', 'sign_tasks']

    @member = mock_member(:member_me, skip_auth: example.metadata[:skip_auth])
    @headers = {
      'Content-Type' => 'application/json',
      'Authorization' => 'Bearer {{rabbit_token}}'
    }
    @task = FactoryBot.create(:draft_task)
    @path = "/api/v1/sign_tasks/#{@task.id}"
  end

  describe '#update' do
    before(:each) do
      @params = {
        file_name: 'new_filename.pdf',
        message: 'message',
        completed_message: 'completed_message',
        reference_setting: [
          {
            'reference_id': 'reference_1_1',
            'file_name': 'reference 1-1',
            'type': 'pdf'
          }
        ],
        completed_reference_setting: [
          {
            'reference_id': 'completed_reference_1_1',
            'file_name': 'completed_reference 1-1',
            'type': 'pdf'
          }
        ]
      }
    end

    it 'should update sign_task file_name', rpdoc_example_key: 200_1, rpdoc_example_name: 'update task success (update file name)' do
      has_order = @task.has_order
      put @path, params: @params.to_json, headers: @headers
      expect(response).to have_http_status(200)
      expect(json['data']['reference_upload_links']).to be_present
      expect(json['data']['completed_reference_upload_links']).to be_present
      @task.reload
      expect(@task.file_name).to eq(@params[:file_name])
      expect(@task.has_order).to eq(has_order)
      expect(@task.task_setting.message).to eq(@params[:message])
      expect(@task.task_setting.completed_message).to eq(@params[:completed_message])
    end

    it 'should update sign_task has_order', rpdoc_example_key: 200_2, rpdoc_example_name: 'update task success (update task order)' do
      file_name = @task.file_name
      params = {has_order: false}
      put @path, params: params.to_json, headers: @headers
      expect(response).to have_http_status(200)
      @task.reload
      expect(@task.file_name).to eq(file_name)
      expect(@task.has_order).to eq(params[:has_order])
    end

    it 'should return 200 and update stage info', rpdoc_skip: true do
      signer = FactoryBot.create(:member_a)
      params = {
        "stages": [
          {
              "pdf_object_info": [
                  "DottedSign_b7076000-5166-11eb-b97b-73074c50641c",
                  "DottedSign_b7076000-5166-11eb-b97b-73074c50641d"
              ],
              "xfdf_info": [
                {
                    "field_type": "signature",
                    "object_id": "DottedSign_b7076000-5166-11eb-b97b-73074c50641c",
                    "custom_id": "custom_id_1",
                    "page": 0,
                    "coord": [100,200,150,250],
                    "options": {
                      "force": true
                    }
                },
                {
                  field_type: 'checkbox',
                  object_id: 'field_object_id_2_1',
                  field_group_object_id: 'field_group_1',
                  page: 0,
                  coord: [100,100,200,200],
                  options: {
                    force: true,
                    read_only: false,
                    default: true
                  }
                },
                {
                  field_type: 'checkbox',
                  object_id: 'field_object_id_2_2',
                  field_group_object_id: 'field_group_1',
                  page: 0,
                  coord: [100,100,200,200],
                  options: {
                    force: true,
                    read_only: false,
                    default: false
                  }
                },
                {
                  field_type: 'radio',
                  object_id: 'field_object_id_2_3',
                  field_group_object_id: 'field_group_2',
                  page: 0,
                  coord: [100,100,200,200],
                  options: {
                    force: false,
                    read_only: false,
                    default: false
                  }
                },
                {
                  field_type: 'radio',
                  object_id: 'field_object_id_2_4',
                  field_group_object_id: 'field_group_2',
                  page: 0,
                  coord: [100,100,200,200],
                  options: {
                    force: false,
                    read_only: false,
                    default: false
                  }
                }
              ],
              field_setting_groups: [
                {
                  field_group_type: 'checkbox',
                  field_group_object_id: 'field_group_1',
                  options: {
                    force: true,
                    read_only: false
                  }
                },
                {
                  field_group_type: 'radio',
                  field_group_object_id: 'field_group_2',
                  options: {
                    force: false,
                    read_only: false
                  }
                }
              ],
              "email": signer.email,
              "name": signer.name,
              "stage_setting": {
                "forward_enable": true,
                "decline_enable": false
              }
          }
        ]
      }

      put @path, params: params.to_json, headers: @headers
      expect(response).to have_http_status(200)
      @task.reload
      expect(@task.stages.count).to eq(1)
      expect(@task.stages.first.stage_setting.forward_enable).to eq(true)
      expect(@task.stages.first.field_settings.first.custom_id).to eq('custom_id_1')

      # Verify field setting groups
      stage_info = params[:stages][0]
      expect(json['data']['stage_infos'][0]['field_setting_groups'].count).to eq(stage_info[:field_setting_groups].count)
      expect(json['data']['stage_infos'][0]['field_settings'][1]['field_group_object_id']).to eq(stage_info[:xfdf_info][1][:field_group_object_id])
      expect(json['data']['stage_infos'][0]['field_settings'][3]['field_group_object_id']).to eq(stage_info[:xfdf_info][3][:field_group_object_id])
    end

    it 'should create modified event', rpdoc_skip: true do
      put @path, params: @params.to_json, headers: @headers
      @task.reload
      event = @task.sign_events.last
      expect(event.action_name).to eq('modified')
    end

    it 'should return 400030 if task not draft', rpdoc_example_key: 400030, rpdoc_example_name: 'update task failed (task not draft)' do
      task = FactoryBot.create(:waiting_for_me1)
      path = "/api/v1/sign_tasks/#{task.id}"
      put path, params: @params.to_json, headers: @headers
      expect(response).to have_http_status(400)
      expect(json['error_code']).to eq(400030)
      expect(json['error_key']).to eq('task_is_not_draft')
    end

    it 'should return 403033 if member not task owner', rpdoc_example_key: 403033, rpdoc_example_name: 'update task failed (member not task owner)' do
      task = FactoryBot.create(:draft_task2)
      path = "/api/v1/sign_tasks/#{task.id}"
      put path, params: @params.to_json, headers: @headers
      expect(response).to have_http_status(403)
      expect(json['error_code']).to eq(403033)
      expect(json['error_key']).to eq('task_not_owned')
    end

    it 'should return 400003 if invalid member', rpdoc_example_key: 400003, rpdoc_example_name: 'update task failed (invalid member)', skip_auth: true do
      @headers['Authorization'] = 'Bearer invalid-token'
      put @path, params: @params.to_json, headers: @headers
      expect(response).to have_http_status(400)
      expect(json['error_code']).to eq(400003)
      expect(json['error_key']).to eq('invalid_member')
    end
  end
end
