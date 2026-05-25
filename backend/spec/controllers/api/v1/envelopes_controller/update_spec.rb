require 'rails_helper'

RSpec.describe Api::V1::EnvelopesController, type: :request do
  include_context 'rpdoc'

  before(:each) do |example|
    example.metadata[:rpdoc_action_key] = 'update'
    example.metadata[:rpdoc_action_name] = 'update envelope'
    example.metadata[:rpdoc_example_folders] = ['v1', 'envelopes']

    @member = mock_member(:member_me, skip_auth: example.metadata[:skip_auth])
    @envelope = FactoryBot.create(:draft_envelope)
    @envelope.reload

    @headers = {
      'Authorization' => 'Bearer {{rabbit_token}}',
      'Content-Type' => 'application/json'
    }
    @path = "/api/v1/envelopes/#{@envelope.id}"
  end

  describe '#update' do
    before(:each) do
      @params = {
        has_order: 1,
        forget_remind: true,
        receiver_lang: "zh-TW",
        message: "",
        envelope_name: "env_d_t01",
        file_list: [
          {
            file_name: "0.15mb",
            task_id: @envelope.sign_tasks.second.id,
            page_num: 4,
            file_size_text: "0.14 MB"
          },
          {
            file_name: "0.2mb",
            task_id: @envelope.sign_tasks.first.id,
            page_num: 2,
            file_size_text: "0.2 MB"
          }
        ],
        client: "web",
        ip_address: "211.22.240.115"
      }
    end

    it 'should return 200 and update the envelope name', rpdoc_example_key: 200, rpdoc_example_name: 'update envelope success (update envelope name)' do
      put @path, params: @params.to_json, headers: @headers
      @envelope.reload
      @envelope.sign_tasks.first.reload
      expect(response).to have_http_status(200)
      expect(json['data']['envelope_name']).to eq(@params[:envelope_name])
      expect(@envelope.sign_tasks.first.position).to eq(2)
    end

    it 'should return 200 and update stages', rpdoc_example_key: 200_2, rpdoc_example_name: 'update envelope success (update stages)' do
      params = @params.merge(
        stages: [
          {
            name: "Levi Ackerman",
            email: "levi@survey.corps",
            pdf_object_info: [
              "JackRabbit_6ee84810-9c09-11ef-a9c6-f7786d3cacf7",
              "JackRabbit_7eccbb80-9c09-11ef-a9c6-f7786d3cacf7"
            ],
            xfdf_info: [
              {
                field_type: "signature",
                object_id: "JackRabbit_6ee84810-9c09-11ef-a9c6-f7786d3cacf7",
                page: 0,
                coord: [33, 758, 214, 808],
                options: {
                  force: true,
                  placeholder: nil
                },
                task_id: @envelope.sign_tasks.first.id
              },
              {
                field_type: "signature",
                object_id: "JackRabbit_7eccbb80-9c09-11ef-a9c6-f7786d3cacf7",
                page: 0,
                coord: [5, 734, 186, 784],
                options: {
                  force: true,
                  placeholder: nil
                },
                task_id: @envelope.sign_tasks.second.id
              }
            ],
            stage_setting: {
              forward_enable: true,
              decline_enable: false
            }
          },
          {
            name: "Hange Zoe",
            email: "hange@survey.corps",
            pdf_object_info: [
              "JackRabbit_74f97940-9c09-11ef-a9c6-f7786d3cacf7",
              "JackRabbit_82fd93f0-9c09-11ef-a9c6-f7786d3cacf7"
            ],
            xfdf_info: [
              {
                field_type: "signature",
                object_id: "JackRabbit_74f97940-9c09-11ef-a9c6-f7786d3cacf7",
                page: 0,
                coord: [30, 656, 211, 707],
                options: {
                  force: true,
                  placeholder: nil
                },
                task_id: @envelope.sign_tasks.first.id
              },
              {
                field_type: "signature",
                object_id: "JackRabbit_82fd93f0-9c09-11ef-a9c6-f7786d3cacf7",
                page: 1,
                coord: [9, 783, 190, 834],
                options: {
                  force: true,
                  placeholder: nil
                },
                task_id: @envelope.sign_tasks.second.id
              }
            ],
            attachment_setting: [
              {
                attachment_id: "uuid-uuid-uuid-1",
                file_name: "test_file",
                force: false,
                viewable_in_processing: true,
                task_id: @envelope.sign_tasks.first.id
              }
            ]
          },
          {
            name: "Erwin Smith",
            email: "erwin@survey.corps",
            pdf_object_info: [
              "JackRabbit_77bb3150-9c09-11ef-a9c6-f7786d3cacf7",
              "JackRabbit_8793e4f0-9c09-11ef-a9c6-f7786d3cacf7",
              "field_object_id_2_1",
              "field_object_id_2_2",
              "field_object_id_2_3",
              "field_object_id_2_4"
            ],
            xfdf_info: [
              {
                field_type: "signature",
                object_id: "JackRabbit_77bb3150-9c09-11ef-a9c6-f7786d3cacf7",
                page: 1,
                coord: [360, 59, 541, 109],
                options: {
                  force: true,
                  placeholder: nil
                },
                task_id: @envelope.sign_tasks.first.id
              },
              {
                field_type: "signature",
                object_id: "JackRabbit_8793e4f0-9c09-11ef-a9c6-f7786d3cacf7",
                page: 2,
                coord: [12, 783, 193, 833],
                options: {
                  force: true,
                  placeholder: nil
                },
                task_id: @envelope.sign_tasks.second.id
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
                },
                task_id: @envelope.sign_tasks.first.id
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
                },
                task_id: @envelope.sign_tasks.first.id
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
                },
                task_id: @envelope.sign_tasks.second.id
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
                },
                task_id: @envelope.sign_tasks.second.id
              }
            ],
            field_setting_groups: [
              {
                field_group_type: 'checkbox',
                field_group_object_id: 'field_group_1',
                options: {
                  force: true,
                  read_only: false
                },
                task_id: @envelope.sign_tasks.first.id
              },
              {
                field_group_type: 'radio',
                field_group_object_id: 'field_group_2',
                options: {
                  force: false,
                  read_only: false
                },
                task_id: @envelope.sign_tasks.second.id
              }
            ],
            attachment_setting: [
              {
                attachment_id: "uuid-uuid-uuid-2",
                file_name: "test_file_2",
                force: false,
                viewable_in_processing: true,
                task_id: @envelope.sign_tasks.second.id
              }
            ]
          }
        ]
      )

      put @path, params: params.to_json, headers: @headers
      expect(response).to have_http_status(200)
      expect(json['data']['stage_infos'].count).to eq(params[:stages].count)
      expect(json['data']['stage_infos'].first['name']).to eq(params[:stages].first[:name])
      expect(json['data']['stage_infos'].first['email']).to eq(params[:stages].first[:email])
      expect(json['data']['stage_infos'].first['stage_setting']['forward_enable']).to eq(params[:stages].first[:stage_setting][:forward_enable])
      expect(json['data']['task_infos'][0]['stage_infos'][2]['attachment_setting'].length).to eq(1)
      expect(json['data']['task_infos'][1]['stage_infos'][1]['attachment_setting'].length).to eq(1)

      # Verify field setting groups
      stage3_info = params[:stages][2]
      expect(json['data']['task_infos'][1]['stage_infos'][2]['field_setting_groups'].count).to eq(1)
      expect(json['data']['task_infos'][0]['stage_infos'][2]['field_setting_groups'].count).to eq(1)
      expect(json['data']['task_infos'][1]['stage_infos'][2]['field_settings'][1]['field_group_object_id']).to eq(stage3_info[:xfdf_info][2][:field_group_object_id])
      expect(json['data']['task_infos'][0]['stage_infos'][2]['field_settings'][1]['field_group_object_id']).to eq(stage3_info[:xfdf_info][4][:field_group_object_id])
    end

    it 'should return 200 and update reference setting', rpdoc_skip: true do
      params = {
        reference_setting: [
          {
            file_name: "Shortcut 2022-06-27 14.51.20.png",
            reference_type: "png",
            reference_id: "reference_file_e7fdfd20-2e7f-11ed-ae87-c7976acf797c"
          },
          {
            file_name: "DottedSign Test.pdf",
            reference_type: "pdf",
            reference_id: "reference_file_e9da1020-2e7f-11ed-ae87-c7976acf797c"
          }
        ],
        completed_reference_setting: [
          {
            file_name: "Shortcut 2022-06-27 14.51.20.png",
            reference_type: "png",
            reference_id: "completed_reference_file_e7fdfd20-2e7f-11ed-ae87-c7976acf797c"
          }
        ]
      }
      put @path, params: params.to_json, headers: @headers
      expect(response).to have_http_status(200)
      @envelope.first_task.setting.reload
      expect(json['data']['reference_setting'].length).to eq(params[:reference_setting].length)
      expect(json['data']['reference_upload_links'].length).to eq(params[:reference_setting].length)
      expect(json['data']['completed_reference_setting'].length).to eq(params[:completed_reference_setting].length)
      expect(json['data']['completed_reference_upload_links'].length).to eq(params[:completed_reference_setting].length)
      expect(@envelope.first_task.setting.reference_setting.length).to eq(0)
      expect(@envelope.first_task.setting.completed_reference_setting.length).to eq(0)
    end

    it 'should return 200 and update tags', rpdoc_skip: true do
      tags = ['tag1', 'tag2']
      params = { tags: tags }
      put @path, params: params.to_json, headers: @headers
      expect(response).to have_http_status(200)
      expect(json['data']['tag_info'][tags[0]]).to be_truthy
      expect(json['data']['tag_info'][tags[1]]).to be_truthy
    end

    it 'should return 403065 if member not envelope owner', rpdoc_example_key: 403065, rpdoc_example_name: 'update envelope failed (member not envelope owner)' do
      envelope = FactoryBot.create(:draft_envelope2)
      path = "/api/v1/envelopes/#{envelope.id}"
      put path, params: @params.to_json, headers: @headers
      expect(response).to have_http_status(403)
      expect(json['error_code']).to eq(403065)
      expect(json['error_key']).to eq('envelope_not_owned')
    end

    it 'should return 400003 if invalid member', rpdoc_example_key: 400003, rpdoc_example_name: 'update envelope failed (invalid member)', skip_auth: true do
      @headers['Authorization'] = 'Bearer invalid-token'
      put @path, params: @params.to_json, headers: @headers
      expect(response).to have_http_status(400)
      expect(json['error_code']).to eq(400003)
      expect(json['error_key']).to eq('invalid_member')
    end
  end
end
