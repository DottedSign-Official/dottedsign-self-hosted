require 'rails_helper'

RSpec.describe Api::V1::SignTasksController, type: :request do
  include_context 'rpdoc'

  before(:each) do |example|
    example.metadata[:rpdoc_example_folders] = ['v1', 'sign_tasks']

    @member = mock_member(:member_me, skip_auth: example.metadata[:skip_auth])
    @headers = {
      'Content-Type' => 'application/json',
      'Authorization' => 'Bearer {{rabbit_token}}'
    }
    @path = '/api/v1/sign_tasks'
  end

  describe '#create' do
    before(:each) do |example|
      example.metadata[:rpdoc_action_key] = 'create'
      example.metadata[:rpdoc_action_name] = 'create task'
      @signer_a = FactoryBot.create(:member_a)
      @signer_b = FactoryBot.create(:member_b)
      @params = {
        "file_name": "create_and_invite",
        "has_order": true,
        "stages": [
          {
            "pdf_object_info": [
              "DottedSign_b7076000-5166-11eb-b97b-73074c50641c",
              "DottedSign_b7076000-5166-11eb-b97b-73074c50641d",
              "DottedSign_b7076000-5166-11eb-b97b-73074c50641e",
              "DottedSign_b7076000-5166-11eb-b97b-73074c50641f"
            ],
            "xfdf_info": [
              {
                "field_type": "signature",
                "object_id": "DottedSign_b7076000-5166-11eb-b97b-73074c50641c",
                "custom_id": "custom_id_1",
                "page": 0,
                "coord": [100, 200, 150, 250],
                "options": {
                  "visible_ca": true,
                  "force": true,
                  "photo": true
                }
              },
              {
                "field_type": "textfield",
                "object_id": "DottedSign_b7076000-5166-11eb-b97b-73074c50641d",
                "page": 0,
                "coord": [110, 210, 150, 250],
                "options": {
                  "force": false,
                  "font_size": 20
                }
              },
              {
                "field_type": 'link',
                "object_id": 'DottedSign_b7076000-5166-11eb-b97b-73074c50641e',
                "page": 0,
                "coord": [110, 240, 150, 270],
                "options": {
                  "force": false,
                  "default": "https://www.google.com",
                  "placeholder": 'Hyperlink 連結'
                }
              },
              {
                'field_type': 'image',
                'object_id': 'DottedSign_b7076000-5166-11eb-b97b-73074c50641f',
                'page': 0,
                'coord': [100,100,200,200],
                'options': {
                  'force': true,
                  'placeholder': nil,
                  'read_only': false
                }
              }
            ],
            "email": @signer_a.email,
            "name": @signer_a.name,
            "stage_setting": {
              "forward_enable": true,
              "decline_enable": false,
              "viewable_in_completed": true,
              "viewable_in_processing": true,
              "viewable_in_processing_attachments": ["uuid-uuid-uuid-1", "uuid-uuid-uuid-2"],
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
            ],
            "attachment_setting": [
              { attachment_id: "uuid-uuid-uuid-1", file_name: "test_file", force: false, viewable_in_processing: true },
              { attachment_id: "uuid-uuid-uuid-2", file_name: "test_file_2", force: false, viewable_in_processing: true },
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
                  default: false
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
        "message": 'This is a message',
        "completed_message": 'This is a completed message',
        "reference_setting": [
          {
            "file_name": "Shortcut 2022-06-27 14.51.20.png",
            "reference_type": "png",
            "reference_id": "reference_file_e7fdfd20-2e7f-11ed-ae87-c7976acf797c"
          },
          {
            "file_name": "DottedSign Test.pdf",
            "reference_type": "pdf",
            "reference_id": "reference_file_e9da1020-2e7f-11ed-ae87-c7976acf797c"
          }
        ],
        "completed_reference_setting": [
          {
            "file_name": "Shortcut 2022-06-27 14.51.20.png",
            "reference_type": "png",
            "reference_id": "reference_file_e7fdfd20-2e7f-11ed-ae87-c7976acf797c"
          }
        ],
        "client": "web",
        "ip_address": "211.22.240.100",
        "need_ca": false
      }
    end

    it 'should return 200 and get task info', rpdoc_example_key: 200, rpdoc_example_name: 'create task success' do
      post @path, params: @params.to_json, headers: @headers
      expect(response).to have_http_status(200)
      expect(json['data']['file_name']).to eq(@params[:file_name])
      expect(json['data']['sign_type']).to eq('create_and_invite')
      expect(json['data']['has_order']).to eq(@params[:has_order])
      expect(json['data']['status']).to eq('draft')
      expect(json['data']['current_member_turn']).to eq(false)
      expect(json['data']['own_by_me']).to eq(true)
      expect(json['data']['message']).to eq(@params[:message])
      expect(json['data']['completed_message']).to eq(@params[:completed_message])
      expect(json['data']['reference_upload_links'].length).to eq(@params[:reference_setting].length)
      expect(json['data']['completed_reference_upload_links'].length).to eq(@params[:completed_reference_setting].length)
      expect(json['data']['stage_infos'][0]['stage_setting']['viewable_in_processing_attachments'].include?(json['data']['stage_infos'][0]['attachment_setting'][0]['attachment_id'])).to eq(true)
      expect(json['data']['stage_infos'][0]['field_settings'][0]['options']['photo']).to eq(true)

      # Verify field setting groups
      stage2_info = @params[:stages][1]
      expect(json['data']['stage_infos'][1]['field_setting_groups'].count).to eq(stage2_info[:field_setting_groups].count)
      expect(json['data']['stage_infos'][1]['field_settings'][0]['field_group_object_id']).to eq(stage2_info[:xfdf_info][0][:field_group_object_id])
      expect(json['data']['stage_infos'][1]['field_settings'][2]['field_group_object_id']).to eq(stage2_info[:xfdf_info][2][:field_group_object_id])
    end

    it 'should return 200 and get stages verify info', rpdoc_example_key: 200_2, rpdoc_example_name: 'create task success with verify methods' do
      post @path, params: @params.to_json, headers: @headers
      expect(response).to have_http_status(200)
      expect(json['data']['stage_infos'][0]['verify_methods'].length).to be_positive
    end

    it "should return 200 and set field custom id", rpdoc_skip: true do
      post @path, params: @params.to_json, headers: @headers
      expect(response).to have_http_status(200)
      expect(json['data']['stage_infos'][0]['field_settings'][0]['custom_id']).to eq(@params[:stages][0][:xfdf_info][0][:custom_id])
    end

    it 'should return 200 and setup systemtime field', rpdoc_example_key: 200_3, rpdoc_example_name: 'create task success with systemtimes' do
      systemtimes = [
        {
          "field_type": "systemtime",
          "object_id": "DottedSign_b7076000-5166-11eb-b97b-73074c50642a",
          "page": 0,
          "coord": [100, 300, 100, 400],
          "options": {
            "format": "year_roc"
          }
        },
        {
          "field_type": "systemtime",
          "object_id": "DottedSign_b7076000-5166-11eb-b97b-73074c50642b",
          "page": 0,
          "coord": [100, 400, 100, 500],
          "options": {
            "format": "year_ad"
          }
        },
        {
          "field_type": "systemtime",
          "object_id": "DottedSign_b7076000-5166-11eb-b97b-73074c50642c",
          "page": 0,
          "coord": [100, 500, 100, 600],
          "options": {
            "format": "month"
          }
        },
        {
          "field_type": "systemtime",
          "object_id": "DottedSign_b7076000-5166-11eb-b97b-73074c50642d",
          "page": 0,
          "coord": [100, 600, 100, 700],
          "options": {
            "format": "day"
          }
        }
      ]
      systemtimes.each { |systemtime| @params[:stages].first[:xfdf_info] << systemtime }

      post @path, params: @params.to_json, headers: @headers

      expect(response).to have_http_status(200)
      task = SignTask.find(json['data']['task_id'])
      expect(task.field_settings.where(field_type: 'systemtime').count).to eq(systemtimes.length)
    end

    it 'should return 200 and setup cc_info', rpdoc_example_key: 200_4, rpdoc_example_name: 'create task success with cc_info' do
      cc_info = [
        { email: "test@test.mail.com", name: "test" },
        { email: "test2@test.mail.com", name: "test2" }
      ]
      @params[:cc_info] = cc_info

      post @path, params: @params.to_json, headers: @headers

      expect(response).to have_http_status(200)
      task = SignTask.find(json['data']['task_id'])
      expect(task.task_setting.cc_info.to_json).to eq(cc_info.to_json)
    end

    it 'should return 400_115 if invalid cert occassion', rpdoc_example_key: 400_115, rpdoc_example_name: '400_115 (invalid cert occassion)' do
      @params[:stages].first[:verify].first[:verify_type] = "cht_personal"
      @params[:stages].first[:verify].first[:occassion] = "read"
      post @path, params: @params.to_json, headers: @headers

      expect(response).to have_http_status(400)
      expect(json['error_code']).to eq(400_115)
      expect(json['error_key']).to eq('invalid_cert_occassion')
    end

    it 'should return 400003 if invalid member', rpdoc_example_key: 400003, rpdoc_example_name: 'create task failed (invalid member)', skip_auth: true do
      @headers['Authorization'] = 'Bearer invalid-token'
      post @path, params: @params.to_json, headers: @headers
      expect(response).to have_http_status(400)
      expect(json['error_code']).to eq(400003)
      expect(json['error_key']).to eq('invalid_member')
    end

    context '>> field_setting_group related errors' do
      it 'should return 400_417 if force param of field_setting_groups are invalid', rpdoc_example_key: 400_417, rpdoc_example_name: 'create draft task failed (invalid force param of field_setting_groups)' do
        # restrict at least 1 field of the checkbox groups to be selected and read_only,
        # but the defaults of all checkboxes are false
        @params[:stages][1][:field_setting_groups][0][:options] = { force: true, read_only: true }
        post(@path, params: @params.to_json, headers: @headers)
        expect(response).to have_http_status(400)
        expect(json['error_code']).to eq(400_417)
        expect(json['error_key']).to eq('invalid_params')
      end

      it 'should return 400_417 if default param of radio fields in group are invalid', rpdoc_example_key: 400_417, rpdoc_example_name: 'create draft task failed (invalid default param of radio fields in group)' do
        # above one of fields in the radio button group are selected
        @params[:stages][1][:xfdf_info][2][:options] = { default: true }
        @params[:stages][1][:xfdf_info][3][:options] = { default: true }
        post(@path, params: @params.to_json, headers: @headers)
        expect(response).to have_http_status(400)
        expect(json['error_code']).to eq(400_417)
        expect(json['error_key']).to eq('invalid_params')
      end

      it 'should return 400_417 if invalid number of fields in group', rpdoc_example_key: 400_417, rpdoc_example_name: 'create draft task failed (invalid number of fields in group)' do
        @params[:stages][1][:xfdf_info].pop
        post(@path, params: @params.to_json, headers: @headers)
        expect(response).to have_http_status(400)
        expect(json['error_code']).to eq(400_417)
        expect(json['error_key']).to eq('invalid_params')
      end
    end

    context '[with review stage]' do
      before(:each) do |example|
        @params[:stages] = @params[:stages][0...1] + [
          {
            action: 'review',
            email: @member.email,
            name: @member.name,
          },
          {
            action: 'review',
            email: @signer_a.email,
            name: @signer_a.name,
          }
        ] + @params[:stages][1..]
      end

      it 'should return 200 with review stages', rpdoc_example_key: '200_review_stages', rpdoc_example_name: 'create task success with review stages' do
        post @path, params: @params.to_json, headers: @headers
        expect(response).to have_http_status(200)
        expect(json['data']['stage_infos'][0]['action']).to eq('sign')
        expect(json['data']['stage_infos'][1]['action']).to eq('review')
        expect(json['data']['stage_infos'][1]['actor_info']['base_stage_id']).to eq(json['data']['stage_infos'][0]['stage_id'])
        expect(json['data']['stage_infos'][2]['action']).to eq('review')
        expect(json['data']['stage_infos'][2]['actor_info']['base_stage_id']).to eq(json['data']['stage_infos'][0]['stage_id'])
      end

      it 'should return 400_417 if duplicate review stage', rpdoc_example_key: '400_417_duplicate_review_stage', rpdoc_example_name: '400_417 (duplicate review stage)' do
        @params[:stages][2][:email] = @member.email
        @params[:stages][2][:name] = @member.name
        post @path, params: @params.to_json, headers: @headers
        expect(response).to have_http_status(400)
        expect(json['error_code']).to eq(400_417)
        expect(json['error_key']).to eq('invalid_params')
      end

      it 'should return 400_417 if no sign stage before review stage', rpdoc_example_key: '400_417_no_sign_stage_before_review_stage', rpdoc_example_name: '400_417 (no sign stage before review stage)' do
        @params[:stages] = [{
          action: 'review',
          email: @member.email,
          name: @member.name,
        }] + @params[:stages]
        post @path, params: @params.to_json, headers: @headers
        expect(response).to have_http_status(400)
        expect(json['error_code']).to eq(400_417)
        expect(json['error_key']).to eq('invalid_params')
      end
    end
  end
end
