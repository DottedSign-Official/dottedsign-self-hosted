require 'rails_helper'

RSpec.describe Api::V1::SignTasksController, type: :request do
  include_context 'rpdoc'

  before(:each) do |example|
    example.metadata[:rpdoc_action_key] = 'sign_and_send'
    example.metadata[:rpdoc_action_name] = 'create sign and send task'
    example.metadata[:rpdoc_example_folders] = ['v1', 'sign_tasks']

    @member = mock_member(:member_me, skip_auth: example.metadata[:skip_auth])
    @signature = FactoryBot.create(:signature, member: @member)
    @image = FactoryBot.create(:image)
    @headers = {
      'Content-Type' => 'application/json',
      'Authorization' => 'Bearer {{rabbit_token}}'
    }
    @path = '/api/v1/sign_tasks/sign_and_send'
  end

  describe '#sign_and_send' do
    before(:each) do
      @params = {
        'file_name': 'sign_and_send',
        'pdf_object_info': ['object_id', 'object_id_2', 'object_id_3'],
        'xfdf_info': [
          {
            'field_type': 'signature',
            'object_id': 'object_id',
            'page': 0,
            'coord': [100,200,150,250]
          },
          {
            'field_type': 'link',
            'object_id': 'object_id_2',
            'page': 0,
            'coord': [100,200,150,250]
          },
          {
            'field_type': 'image',
            'object_id': 'object_id_3',
            'page': 0,
            'coord': [100,200,150,250]
          }
        ],
        'sign_info': [
          {
            'object_id': 'object_id',
            'type': 'signature',
            'value': @signature.id
          },
          {
            'object_id': 'object_id_2',
            'type': 'link',
            'value': 'https://test.com'
          },
          {
            'object_id': 'object_id_3',
            'type': 'image',
            'value': @image.id
          }
        ],
        'client': 'web',
        'ip_address': '127.0.0.1'
      }
    end

    it 'should return 200 and get task info', rpdoc_example_key: 200, rpdoc_example_name: 'create sign and send task success' do
      post @path, params: @params.to_json, headers: @headers
      expect(response).to have_http_status(200)
      expect(json['data']['file_name']).to eq(@params[:file_name])
      expect(json['data']['sign_type']).to eq('sign_and_send')
      expect(json['data']['status']).to eq('draft')
      expect(json['data']['current_stage_ids']).to eq([])
      expect(json['data']['current_member_turn']).to eq(false)
      expect(json['data']['own_by_me']).to eq(true)
    end

    it 'should return 400003 if invalid member', rpdoc_example_key: 400003, rpdoc_example_name: 'create sign and send task failed (invalid member)', skip_auth: true do
      @headers['Authorization'] = 'Bearer invalid-token'
      post @path, params: @params.to_json, headers: @headers
      expect(response).to have_http_status(400)
      expect(json['error_code']).to eq(400003)
      expect(json['error_key']).to eq('invalid_member')
    end

    it 'should return 404030 if signature not exist', rpdoc_example_key: 404030, rpdoc_example_name: 'create sign and send task failed (signature not found)' do
      @params[:sign_info][0][:value] = 0
      post @path, params: @params.to_json, headers: @headers
      expect(response).to have_http_status(404)
      expect(json['error_code']).to eq(404030)
      expect(json['error_key']).to eq('signature_not_found')
    end

    context '>> sign and send with field_setting_groups' do
      before(:each) do
        @params[:field_setting_groups] = [
          { field_group_type: 'checkbox', field_group_object_id: 'field_group_1', options: { force: false, read_only: false } },
          { field_group_type: 'radio', field_group_object_id: 'field_group_2', options: { force: false, read_only: false } }
        ]
        @params[:xfdf_info] += [
          { field_type: 'checkbox', field_object_id: 'field_object_id_1_6', field_group_object_id: 'field_group_1', page: 0, coord: [100,100,200,200] },
          { field_type: 'checkbox', field_object_id: 'field_object_id_1_7', field_group_object_id: 'field_group_1', page: 0, coord: [100,100,200,200] },
          { field_type: 'radio', field_object_id: 'field_object_id_1_8', field_group_object_id: 'field_group_2', page: 0, coord: [100,100,200,200] },
          { field_type: 'radio', field_object_id: 'field_object_id_1_9', field_group_object_id: 'field_group_2', page: 0, coord: [100,100,200,200] }
        ]
        @params[:sign_info] += [
          { field_type: 'checkbox', field_value: true, field_object_id: 'field_object_id_1_6' },
          { field_type: 'checkbox', field_value: true, field_object_id: 'field_object_id_1_7' },
          { field_type: 'radio', field_value: true, field_object_id: 'field_object_id_1_8' },
          { field_type: 'radio', field_value: false, field_object_id: 'field_object_id_1_9' }
        ]
      end

      it 'should return 200 with field_setting_groups', rpdoc_example_key: '200_with_field_setting_groups', rpdoc_example_name: '建立自己簽署任務成功 (with field_setting_groups)' do |example|
        post @path, params: @params.to_json, headers: @headers
        expect(response).to have_http_status(200)
      end

      it 'should return 400_417 if invalid type of field in group' do
        @params[:xfdf_info] += [
          { field_type: 'checkbox', field_object_id: 'field_object_id_1_10', field_group_object_id: 'field_group_2', page: 0, coord: [100,100,200,200] }
        ]
        post @path, params: @params.to_json, headers: @headers
        expect(response).to have_http_status(400)
        expect(json['error_code']).to eq(400_417)
        expect(json['error_key']).to eq('invalid_params')
      end
    end
  end
end
