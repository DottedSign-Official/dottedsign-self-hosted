require 'rails_helper'

RSpec.describe Api::V1::TemplatesController, type: :request do
  include_context 'rpdoc'

  before(:each) do |example|
    example.metadata[:rpdoc_action_key] = 'create'
    example.metadata[:rpdoc_action_name] = 'create template'
    example.metadata[:rpdoc_example_folders] = ['v1', 'templates']

    @member = mock_member(:member_me, skip_auth: example.metadata[:skip_auth])
    @headers = {
      'Content-Type' => 'application/json',
      'Authorization' => 'Bearer {{rabbit_token}}'
    }
    @path = '/api/v1/templates'
  end

  describe '#create' do
    before(:each) do
      @params = {
        file_name: 'Template 1',
        has_order: true,
        code: 'test',
        stages: [
          {
            pdf_object_info: ['object_id_1', 'object_id_2', 'object_id_3'],
            xfdf_info: [
              {
                field_type: 'signature',
                object_id: 'object_id_1',
                page: 0,
                coord: [87.24052718286656,789.5576606260297,160.75782537067545,814.0634266886327],
                options: {
                  visible_ca: true,
                  force: true
                },
                custom_id: 'custom_id_1'
              },
              {
                field_type: 'link',
                object_id: 'object_id_2',
                page: 0,
                coord: [110, 240, 150, 270],
                options: {
                  force: false,
                  default: 'https://www.google.com',
                  placeholder: 'Hyperlink 連結'
                }
              },
              {
                field_type: 'image',
                object_id: 'object_id_3',
                page: 0,
                coord: [100, 100, 200, 200],
                options: {
                  force: true,
                  placeholder: nil,
                  read_only: false
                }
              }
            ],
            role: 'Signer1',
            attachment_setting: [],
            verify: [
              {
                verify_type: "email",
                occassion: "read",
                sequence: 1
              }
            ]
          },
          {
            role: 'Signer2',
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
            attachment_settings: [
              {
                attachment_id: 'attachment_2_1',
                file_name: 'attachment 2-1',
                force: true,
                viewable_in_processing: true
              }
            ]
          }
        ],
        client: 'web',
        ip_address: '127.0.0.1'
      }
    end

    it 'should return 200 and create success', rpdoc_example_key: 200, rpdoc_example_name: 'create template success' do
      post @path, params: @params.to_json, headers: @headers
      expect(response).to have_http_status(200)
      expect(Template.count).to eq(1)
      expect(Template.last.file_name).to eq(@params[:file_name])
      expect(Template.last.code).to eq(@params[:code])
      expect(Template.last.status).to eq('processing')
      
      # Verify field setting groups
      stage_info = @params[:stages][1]
      expect(json['data']['detail'][1]['field_setting_groups'].count).to eq(stage_info[:field_setting_groups].count)
      expect(json['data']['detail'][1]['field_settings'][0]['field_group_object_id']).to eq(stage_info[:xfdf_info][0][:field_group_object_id])
      expect(json['data']['detail'][1]['field_settings'][2]['field_group_object_id']).to eq(stage_info[:xfdf_info][2][:field_group_object_id])

      # Verify verify methods
      expect(json['data']['detail'][0]['verify_methods'].count).to eq(@params[:stages][0][:verify].count)
    end

    it 'should return 200 and get field setting custom id', rpdoc_example_key: 200_1, rpdoc_example_name: 'create template with field custom id success' do
      post @path, params: @params.to_json, headers: @headers
      expect(response).to have_http_status(200)
      expect(Template.last.stages.first.field_settings.first.custom_id).to eq('custom_id_1')
    end

    it 'should return 400003 if invalid member', rpdoc_example_key: 400003, rpdoc_example_name: 'create template failed (invalid member)', skip_auth: true do
      @headers['Authorization'] = 'Bearer invalid-token'
      post @path, params: @params.to_json, headers: @headers
      expect(response).to have_http_status(400)
      expect(json['error_code']).to eq(400003)
      expect(json['error_key']).to eq('invalid_member')
    end

    it 'should return 400_080 if code duplicated', rpdoc_example_key: 400_080, rpdoc_example_name: 'create template failed (invalid member)' do
      @template = FactoryBot.create(:template)
      @params['code'] = @template.code

      post @path, params: @params.to_json, headers: @headers

      expect(response).to have_http_status(400)
      expect(json['error_code']).to eq(400_080)
      expect(json['error_key']).to eq('duplicate_template_code')
    end

    context '>> field_setting_group related errors' do
      it 'should return 400_417 if force param of field_setting_groups are invalid', rpdoc_example_key: 400_417, rpdoc_example_name: 'create template failed (invalid force param of field_setting_groups)' do
        # restrict at least 1 field of the checkbox groups to be selected and read_only,
        # but the defaults of all checkboxes are false
        @params[:stages][1][:field_setting_groups][0][:options] = { force: true, read_only: true }
        post(@path, params: @params.to_json, headers: @headers)
        expect(response).to have_http_status(400)
        expect(json['error_code']).to eq(400_417)
        expect(json['error_key']).to eq('invalid_params')
      end

      it 'should return 400_417 if default param of radio fields in group are invalid', rpdoc_example_key: 400_417, rpdoc_example_name: 'create template failed (invalid default param of radio fields in group)' do
        # above one of fields in the radio button group are selected
        @params[:stages][1][:xfdf_info][2][:options] = { default: true }
        @params[:stages][1][:xfdf_info][3][:options] = { default: true }
        post(@path, params: @params.to_json, headers: @headers)
        expect(response).to have_http_status(400)
        expect(json['error_code']).to eq(400_417)
        expect(json['error_key']).to eq('invalid_params')
      end

      it 'should return 400_417 if invalid number of fields in group', rpdoc_example_key: 400_417, rpdoc_example_name: 'create template failed (invalid number of fields in group)' do
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
            role: 'Reviewer',
          },
          {
            action: 'review',
            role: 'Reviewer 2',
          }
        ] + @params[:stages][1..]
      end

      it 'should return 200 with review stages', rpdoc_example_key: '200_review_stages', rpdoc_example_name: 'create template success with review stages' do
        post @path, params: @params.to_json, headers: @headers
        expect(response).to have_http_status(200)
        expect(json['data']['detail'][0]['action']).to eq('sign')
        expect(json['data']['detail'][1]['action']).to eq('review')
        expect(json['data']['detail'][1]['actor_info']['base_stage_id']).to eq(json['data']['detail'][0]['stage_id'])
        expect(json['data']['detail'][2]['action']).to eq('review')
        expect(json['data']['detail'][2]['actor_info']['base_stage_id']).to eq(json['data']['detail'][0]['stage_id'])
      end

      it 'should return 400_417 if no sign stage before review stage', rpdoc_example_key: '400_417_no_sign_stage_before_review_stage', rpdoc_example_name: '400_417 (no sign stage before review stage)' do
        @params[:stages] = [{
          action: 'review',
          role: 'Reviewer',
        }] + @params[:stages]
        post @path, params: @params.to_json, headers: @headers
        expect(response).to have_http_status(400)
        expect(json['error_code']).to eq(400_417)
        expect(json['error_key']).to eq('invalid_params')
      end
    end
  end
end
