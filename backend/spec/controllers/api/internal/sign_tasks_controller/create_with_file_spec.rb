require 'rails_helper'

RSpec.describe Api::Internal::SignTasksController, type: :request do
  include_context 'rpdoc'

  before(:each) do |example|
    example.metadata[:rpdoc_action_key] = 'create_with_file'
    example.metadata[:rpdoc_action_name] = '含原檔的建立任務'
    example.metadata[:rpdoc_example_folders] = ['internal', 'sign_tasks']

    @member = mock_member(:member_me, skip_auth: false)
    @headers = { 'Content-Type' => 'application/json' }
    @path = '/api/internal/sign_tasks'
  end

  describe '#create_with_file' do
    before(:each) do |example|
      mock_upload
      mock_file_processing_service
      mock_with_sign_url_enable
      @signer = FactoryBot.create(:member_a)
      @params = {
        'member_id': @member.id,
        'file_name': 'create_and_invite',
        'has_order': true,
        'stages': [
          {
            'pdf_object_info': [
              'DottedSign_b7076000-5166-11eb-b97b-73074c50641c',
              'DottedSign_b7076000-5166-11eb-b97b-73074c50641d'
            ],
            'xfdf_info': [
              {
                'field_type': 'signature',
                'object_id': 'DottedSign_b7076000-5166-11eb-b97b-73074c50641c',
                'custom_id': 'signature_1',
                'page': 0,
                'coord': [100, 200, 100, 200],
                'options': {
                  'force': true
                }
              }, {
                'field_type': 'textfield',
                'object_id': 'DottedSign_b7076000-5166-11eb-b97b-73074c50641d',
                'page': 0,
                'coord': [110, 210, 110, 210],
                'options': {
                  'force': false,
                  'font_size': 20
                }
              }
            ],
            'email': @signer.email,
            'name': @signer.name,
            'stage_setting': {
              'forward_enable': true,
              'decline_enable': false
            }
          }
        ],
        'client': 'web',
        "need_ca":false,
        'ip_address': '211.22.240.100'
      }

      file = open("#{Rails.root}/spec/fixtures/files/test.pdf")
      @params[:file] = Base64.strict_encode64(file.read)
    end

    it 'should return 200 and get task info', rpdoc_example_key: 200, rpdoc_example_name: 'create task with file success' do
      post "#{@path}/create_with_file", params: @params.to_json, headers: @headers
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
      expect(json['data']['stage_infos'][0]['field_settings'][0]['custom_id']).to eq('signature_1')
    end
  end
end
