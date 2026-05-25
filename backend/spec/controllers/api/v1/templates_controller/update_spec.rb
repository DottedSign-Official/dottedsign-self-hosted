require 'rails_helper'

RSpec.describe Api::V1::TemplatesController, type: :request do
  include_context 'rpdoc'

  before(:each) do |example|
    example.metadata[:rpdoc_action_key] = 'update'
    example.metadata[:rpdoc_action_name] = 'update template'
    example.metadata[:rpdoc_example_folders] = ['v1', 'templates']

    @member = mock_member(:member_me, skip_auth: example.metadata[:skip_auth])
    @headers = {
      'Content-Type' => 'application/json',
      'Authorization' => 'Bearer {{rabbit_token}}'
    }
    @path = '/api/v1/templates'
    @member.tag_list.add(['Tag 1', 'Tag 2', 'Tag 3'])
    @member.save
  end

  describe '#update' do
    before(:each) do
      @template = FactoryBot.create(:template, dummy_stage_count: 3)
      @path += "/#{@template.id}"
      @member.tag(@template, with: ['Tag 1', 'Tag 2'], on: :tags)
      @params = { file_name: 'New File Name', code: 'new_code' }
    end

    it 'should return 200 and update file_name', rpdoc_example_key: 200_1, rpdoc_example_name: 'update template success (update template name)' do
      put @path, params: @params.to_json, headers: @headers
      expect(response).to have_http_status(200)
      expect(json['data']['file_name']).to eq(@params[:file_name])
      expect(json['data']['code']).to eq(@params[:code])
      expect(json['data']['has_order']).to eq(@template.has_order)
      expect(json['data']['tags']).to eq({ 'Tag 1' => true, 'Tag 2' => true, 'Tag 3' => false })
      expect(json['data']['upload_link']).to be_present
    end

    it 'should return 200 if update tags', rpdoc_example_key: 200_2, rpdoc_example_name: 'update template success (update template tags)' do
      params = { tags: ['Tag 1', 'Tag 3'] }
      put @path, params: params.to_json, headers: @headers
      expect(json['data']['file_name']).to eq(@template.file_name)
      expect(json['data']['has_order']).to eq(@template.has_order)
      expect(json['data']['tags']).to eq({ 'Tag 1' => true, 'Tag 2' => false, 'Tag 3' => true })
    end

    it 'should return 200 if update empty tags', rpdoc_example_key: 200_3, rpdoc_example_name: 'update template success (update template empty tags)' do
      params = { tags: [] }

      put @path, params: params.to_json, headers: @headers
      expect(json['data']['file_name']).to eq(@template.file_name)
      expect(json['data']['has_order']).to eq(@template.has_order)
      expect(json['data']['tags']).to eq({ 'Tag 1' => false, 'Tag 2' => false, 'Tag 3' => false })
    end

    it 'should return 200 if code not changed ', rpdoc_skip: true do
      @params[:code] = @template.code

      put @path, params: @params.to_json, headers: @headers
      expect(response).to have_http_status(200)
      expect(json['data']['code']).to eq(@template[:code])
    end

    it 'should return 200 if stages info changed', rpdoc_skip: true do
      params = {
        stages: [
          {
            pdf_object_info: ['pdf_object_info'],
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
          }
        ]
      }

      put @path, params: params.to_json, headers: @headers
      expect(response).to have_http_status(200)
      expect(Template.last.stages.first.field_settings.first.custom_id).to eq('custom_id_1')
      expect(json['data']['detail'][0]['verify_methods'].count).to eq(params[:stages][0][:verify].count)
    end

    it 'should return 400003 if invalid member', rpdoc_example_key: 400003, rpdoc_example_name: 'update template failed (invalid member)', skip_auth: true do
      @headers['Authorization'] = 'Bearer invalid-token'
      put @path, params: @params.to_json, headers: @headers
      expect(response).to have_http_status(400)
      expect(json['error_code']).to eq(400003)
      expect(json['error_key']).to eq('invalid_member')
    end

    it 'should return 400_080 if code duplicated', rpdoc_example_key: 400_080, rpdoc_example_name: 'create template failed (invalid member)' do
      new_template = FactoryBot.create(:template)
      @params['code'] = new_template.code

      put @path, params: @params.to_json, headers: @headers

      expect(response).to have_http_status(400)
      expect(json['error_code']).to eq(400_080)
      expect(json['error_key']).to eq('duplicate_template_code')
    end
  end
end
