# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Api::V1::PublicFormsController, type: :request do
  include_context 'rpdoc'

  before(:each) do |example|
    example.metadata[:rpdoc_action_key] = 'update'
    example.metadata[:rpdoc_action_name] = '修改公開表單'
    example.metadata[:rpdoc_example_folders] = ['v1', 'public_forms']

    @member = mock_member(:member_me, skip_auth: example.metadata[:skip_auth])
    @form = FactoryBot.create(:public_form, owner: @member, sent_num: 2)
    FactoryBot.create_list(:completed_task1, 2, public_form: @form)
    @form.unpublish! if example.metadata[:unpublish_form]
    @member.tag(@form.template, with: ['tag1', 'tag2'], on: :tags)

    mock_headers
    @path = "/api/v1/public_forms/#{@form.id}"
    @params = {
      form_name: 'Test Form 2',
      description: 'This is test form 2',
      goal_num: 2,
      end_at: 1.day.after.to_i,
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
          role: 'Newer Signer'
        },
        {
          action: "sign",
          attachment_setting: [],
          field_setting_groups: [],
          role: "Normal Signer",
          pdf_object_info: ['pdf_object_info'],
          stage_setting: {
              forward_enable: false,
              decline_enable: true,
              viewable_in_processing: true,
              viewable_in_completed: true,
              reviewed_skip_confirm: true,
              viewable_in_processing_attachments: []
          },
          xfdf_info: [
            {
              field_type: 'signature',
              object_id: 'pdf_object_info',
              page: 0,
              coord: [87.24052718286656,789.5576606260297,160.75782537067545,814.0634266886327],
              options: {
                force: true
              },
              custom_id: 'custom_id_1'
            }
          ]
        }
      ],
      signer_infos: [
        {
          signer_type: 'form_signer',
          requisite: {
            name: 'required',
            email: 'optional'
          }
        },
        {
          name: 'Normal Signer',
          email: 'normal@example.com',
          signer_type: 'normal_signer',
        }
      ],
      tags: ['tag1', 'tag3'],
      cc_info: [
        { email: "cc@test.mail.com", name: "cc" },
        { email: "cc2@test.mail.com", name: "cc2" }
      ],
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

  describe 'update' do
    it 'should return 200', rpdoc_example_key: 200, rpdoc_example_name: 'update public form success', unpublish_form: true do
      put @path, params: @params.to_json, headers: @headers
      expect(response).to have_http_status(200)
      expect(json['data']['form_name']).to eq('Test Form 2')
      expect(json['data']['status']).to eq('terminated')
      expect(json['data']['reach_limit']).to be_truthy
      expect(json['data']['form_info']['detail'][1]['role']).to eq(@params[:stages][1][:role])
      expect(json['data']['form_info']['tags']['tag2']).to be_falsy
      expect(json['data']['form_info']['tags']['tag3']).to be_truthy
      expect(json['data']['form_info']['cc_info'].length).to eq(@params[:cc_info].length)
      expect(json['data']['form_info']['message']).to eq(@params[:message])
      expect(json['data']['form_info']['completed_message']).to eq(@params[:completed_message])
      expect(json['data']['form_info']['reference_upload_links'].length).to eq(@params[:reference_setting].length)
      expect(json['data']['form_info']['completed_reference_upload_links'].length).to eq(@params[:completed_reference_setting].length)
    end

    it 'should return 404_043 if form not found', rpdoc_example_key: 404_043, rpdoc_example_name: 'show public form failed (form not exist)' do
      @path = '/api/v1/public_forms/-1'
      put @path, params: @params.to_json, headers: @headers
      expect(response).to have_http_status(404)
      expect(json['error_code']).to eq(404_043)
      expect(json['error_key']).to eq('form_not_found')
    end

    it 'should return 400_915 if form is delete', rpdoc_example_key: 400_915, rpdoc_example_name: 'show public form failed (form deleted)' do
      @form.set_delete
      put @path, params: @params.to_json, headers: @headers
      expect(response).to have_http_status(400)
      expect(json['error_code']).to eq(400_915)
      expect(json['error_key']).to eq('form_is_deleted')
    end

    it 'should return 400_417 if params is invalid (invalid status)', rpdoc_example_key: 400_417, rpdoc_example_name: 'create public form failed (invalid_params, invalid status)' do
      @params[:status] = 'invalid_status'
      put @path, params: @params.to_json, headers: @headers
      expect(response).to have_http_status(400)
      expect(json['error_code']).to eq(400_417)
      expect(json['error_key']).to eq('invalid_params')
    end

    it 'should return 400_417 if params is invalid (invalid goal_num)', unpublish_form: true, rpdoc_example_key: 400_417_2, rpdoc_example_name: 'create public form failed (invalid_params, invalid goal_num)' do
      @params[:goal_num] = 1
      put @path, params: @params.to_json, headers: @headers
      expect(response).to have_http_status(400)
      expect(json['error_code']).to eq(400_417)
      expect(json['error_key']).to eq('invalid_params')
    end

    it 'should return 400_417 if params is invalid (invalid end_at)', rpdoc_example_key: 400_417_3, rpdoc_example_name: 'create public form failed (invalid_params, invalid end_at)' do
      @params[:end_at] = 10.minutes.ago.to_i
      put @path, params: @params.to_json, headers: @headers
      expect(response).to have_http_status(400)
      expect(json['error_code']).to eq(400_417)
      expect(json['error_key']).to eq('invalid_params')
    end

    it 'should return 400_918 if public form not unpublish', rpdoc_example_key: 400_918, rpdoc_example_name: 'update public form failed (public form should be unpublish)' do
      put @path, params: @params.to_json, headers: @headers
      expect(response).to have_http_status(400)
      expect(json['error_code']).to eq(400_918)
      expect(json['error_key']).to eq('form_should_unpublish')
    end

    it 'should return 400_914 if invalid form info', rpdoc_example_key: 400_914, rpdoc_example_name: 'update public form failed (invalid form info)', unpublish_form: true do
      @params[:signer_infos] << @params[:signer_infos][0]
      put @path, params: @params.to_json, headers: @headers
      expect(response).to have_http_status(400)
      expect(json['error_code']).to eq(400_914)
      expect(json['error_key']).to eq('invalid_form_info')
    end
  end
end
