require 'rails_helper'

RSpec.describe Api::V1::SignTasksController, type: :request do
  include_context 'rpdoc'

  before(:each) do |example|
    example.metadata[:rpdoc_example_folders] = ['v1', 'sign_tasks']

    @member = mock_member(:member_me, skip_auth: example.metadata[:skip_auth])
    @headers = { 'Authorization' => 'Bearer {{rabbit_token}}', 'Content-Type' => 'application/json' }
    @path = "/api/v1/sign_tasks/create_with_file"
  end

  describe '#create_with_file' do
    before(:each) do |example|
      mock_upload
      mock_file_processing_service
      mock_with_sign_url_enable

      example.metadata[:rpdoc_action_key] = 'create_with_file'
      example.metadata[:rpdoc_action_name] = 'create task with file'

      @signer_a = FactoryBot.create(:member_a)
      @signer_b = FactoryBot.create(:member_b)
      @params = {
        "file_name": "create_and_invite",
        "has_order": true,
        "receiver_lang": "en",
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
                "page": 0,
                "coord": [100, 200, 150, 250],
                "options": {
                  "visible_ca": true,
                  "force": true
                }
              }, {
                "field_type": "textfield",
                "object_id": "DottedSign_b7076000-5166-11eb-b97b-73074c50641d",
                "page": 0,
                "coord": [110, 210, 150, 250],
                "options": {
                  "force": false,
                  "font_size": 20
                }
              }
            ],
            "email": @signer_a.email,
            "name": @signer_a.name,
            "stage_setting": {
              "forward_enable": true,
              "decline_enable": false,
            },
            "verify": [
              {
                "verify_type": "email",
                "occassion": "sign",
                "sequence": 1
              },
              {
                "verify_type": "sms",
                "verify_source": "+88663131660",
                "occassion": "read",
                "sequence": 1
              }
            ]
          },
          {
            email: @signer_b.email,
            name: @signer_b.name,
            xfdf_info: [
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
            attachment_setting: [
              {
                attachment_id: 'att_2_1',
                file_name: 'attachment 2-1',
                force: true,
                viewable_in_processing: true
              }
            ],
            stage_setting: {
                forward_enable: false,
                decline_enable: false,
                viewable_in_processing: false,
                viewable_in_completed: true,
                viewable_in_processing_attachments: []
            },
            verify_methods: [
              {
                verify_type: 'cht_personal',
                occassion: 'read'
              }
            ]
          }
        ],
        "with_sign_url": true,
        "need_ca": false,
        "client": "web",
        "ip_address": "211.22.240.100"
      }

      file = open("#{Rails.root}/spec/fixtures/files/test.pdf")
      @params[:file] = Base64.strict_encode64(file.read)
    end

    it 'should return 200 and get task info', rpdoc_example_key: 200, rpdoc_example_name: 'create task with file success' do
      post @path, params: @params.to_json, headers: @headers
      expect(response).to have_http_status(200)
      expect(json['data']['file_name']).to eq(@params[:file_name])
      expect(json['data']['sign_type']).to eq('create_and_invite')
      expect(json['data']['has_order']).to eq(@params[:has_order])
      expect(json['data']['status']).to eq('waiting')
      expect(json['data']['current_member_turn']).to eq(false)
      expect(json['data']['own_by_me']).to eq(true)
      json['data']['stage_infos'].each do |stage|
        expect(stage['sign_url']).to be_present
      end

      # Verify field setting groups
      stage2_info = @params[:stages][1]
      expect(json['data']['stage_infos'][1]['field_setting_groups'].count).to eq(stage2_info[:field_setting_groups].count)
      expect(json['data']['stage_infos'][1]['field_settings'][0]['field_group_object_id']).to eq(stage2_info[:xfdf_info][0][:field_group_object_id])
      expect(json['data']['stage_infos'][1]['field_settings'][2]['field_group_object_id']).to eq(stage2_info[:xfdf_info][2][:field_group_object_id])
    end
  end
end
