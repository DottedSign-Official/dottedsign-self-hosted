# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Api::V1::PublicFormsController, type: :request do
  include_context 'rpdoc'

  before(:each) do |example|
    example.metadata[:rpdoc_action_key] = 'create'
    example.metadata[:rpdoc_action_name] = '建立公開表單'
    example.metadata[:rpdoc_example_folders] = ['v1', 'public_forms']

    @member = mock_member(:member_me, skip_auth: example.metadata[:skip_auth])

    mock_headers
    @path = '/api/v1/public_forms'
    @params = {
      form_name: 'Test Form',
      status: 'unpublish',
      description: 'This is test form',
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
          attachment_setting: [
            {
              attachment_id: 'attachment_2_1',
              file_name: 'attachment 2-1',
              force: true,
              viewable_in_processing: true
            }
          ]
        }
      ],
      signer_infos: [
        {
          signer_type: 'form_signer',
          requisite: {
            name: 'required',
            email: 'required'
          }
        },
        {
          signer_type: 'normal_signer',
          requisite: {
            name: 'required',
            email: 'required'
          }
        }
      ],
      cc_info: [
        { email: "cc@test.mail.com", name: "cc" },
        { email: "cc2@test.mail.com", name: "cc2" }
      ],
      tags: ['tag1', 'tag2'],
      message: 'This is a message',
      completed_message: 'This is a completed message',
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
          reference_id: "reference_file_e7fdfd20-2e7f-11ed-ae87-c7976acf797c"
        }
      ]
    }
  end

  describe '#create' do
    it 'should return 200', rpdoc_example_key: 200, rpdoc_example_name: 'create public form success' do
      expect { post @path, params: @params.to_json, headers: @headers }
        .to change { @member.public_forms.count }.by(1)
      expect(response).to have_http_status(200)
      expect(json['data']['form_name']).to eq(@params[:form_name])
      expect(json['data']['form_info']['file_name']).to eq(@params[:form_name])
      expect(json['data']['form_info']['tags'][@params[:tags][0]]).to be_truthy
      expect(json['data']['form_info']['tags'][@params[:tags][1]]).to be_truthy
      expect(json['data']['form_info']['upload_link']).to be_present
      expect(json['data']['form_info']['detail'][0]['verify_methods'][0]['verify_type']).to eq(@params[:stages][0][:verify][0][:verify_type])
      expect(json['data']['form_info']['cc_info'].length).to eq(@params[:cc_info].length)
      expect(json['data']['form_info']['message']).to eq(@params[:message])
      expect(json['data']['form_info']['completed_message']).to eq(@params[:completed_message])
      expect(json['data']['form_info']['reference_upload_links'].length).to eq(@params[:reference_setting].length)
      expect(json['data']['form_info']['completed_reference_upload_links'].length).to eq(@params[:completed_reference_setting].length)
    end

    it 'should return 400_914 if invalid form info', rpdoc_example_key: 400_914, rpdoc_example_name: 'create public form failed (invalid form info)' do
      @params[:signer_infos].pop
      post @path, params: @params.to_json, headers: @headers
      expect(response).to have_http_status(400)
      expect(json['error_code']).to eq(400_914)
    end

    it 'should return 400_914 if invalid form info', rpdoc_example_key: 400_914_2, rpdoc_example_name: 'create public form failed (invalid form info)' do
      @params[:signer_infos][0][:requisite][:email] = 'optional'
      post @path, params: @params.to_json, headers: @headers
      expect(response).to have_http_status(400)
      expect(json['error_code']).to eq(400_914)
    end

    it 'should return 400_417 if params is invalid (requisite has no required)', rpdoc_example_key: 400_417, rpdoc_example_name: 'create public form failed (invalid_params, requisite has no required)' do
      @params[:signer_infos][0][:requisite][:name] = 'optional'
      @params[:signer_infos][0][:requisite][:email] = 'optional'
      post @path, params: @params.to_json, headers: @headers
      expect(response).to have_http_status(400)
      expect(json['error_code']).to eq(400_417)
      expect(json['error_key']).to eq('invalid_params')
    end

    it 'should return 400_417 if params is invalid (invalid status)', rpdoc_example_key: 400_417_2, rpdoc_example_name: 'create public form failed (invalid_params, invalid status)' do
      @params[:status] = 'invalid_status'
      post @path, params: @params.to_json, headers: @headers
      expect(response).to have_http_status(400)
      expect(json['error_code']).to eq(400_417)
      expect(json['error_key']).to eq('invalid_params')
    end

    it 'should return 400_417 if params is invalid (invalid goal_num)', rpdoc_example_key: 400_417_3, rpdoc_example_name: 'create public form failed (invalid_params, invalid goal_num)' do
      @params[:goal_num] = 0
      post @path, params: @params.to_json, headers: @headers
      expect(response).to have_http_status(400)
      expect(json['error_code']).to eq(400_417)
      expect(json['error_key']).to eq('invalid_params')
    end

    it 'should return 400_417 if params is invalid (invalid end_at)', rpdoc_example_key: 400_417_4, rpdoc_example_name: 'create public form failed (invalid_params, invalid end_at)' do
      @params[:end_at] = 0
      post @path, params: @params.to_json, headers: @headers
      expect(response).to have_http_status(400)
      expect(json['error_code']).to eq(400_417)
      expect(json['error_key']).to eq('invalid_params')
    end

    it 'should return 400_417 if params include encryptable settings', rpdoc_example_key: 400_417_5, rpdoc_example_name: 'create public form failed (invalid_params, encryptable settings are not supported)' do
      @params[:is_encrypted] = true
      @params[:completion_password] = 'test_password'
      post @path, params: @params.to_json, headers: @headers
      expect(response).to have_http_status(400)
      expect(json['error_code']).to eq(400_417)
      expect(json['error_key']).to eq('invalid_params')
    end

    it 'should return 400_001 if template params is missing', rpdoc_example_key: 400_001, rpdoc_example_name: 'create public form failed (template params missing)' do
      @params.delete(:stages)
      post @path, params: @params.to_json, headers: @headers
      expect(response).to have_http_status(400)
      expect(json['error_code']).to eq(400_001)
      expect(json['error_key']).to eq('need_more_information')
    end
  end
end
