require 'rails_helper'

RSpec.describe Api::V1::SignTasksController, type: :request do
  include_context 'rpdoc'

  before(:each) do |example|
    example.metadata[:rpdoc_example_folders] = ['v1', 'sign_tasks']

    @member = mock_member(:member_me, skip_auth: example.metadata[:skip_auth])

    @headers = { 'Authorization' => 'Bearer {{rabbit_token}}', 'Content-Type' => 'application/json' }
    @path = "/api/v1/sign_tasks"
  end

  describe '#create_from_template' do
    before(:each) do |example|
      example.metadata[:rpdoc_action_key] = 'create_from_template'
      example.metadata[:rpdoc_action_name] = 'create task from template'
      mock_file_attached
      mock_with_sign_url_enable

      allow_any_instance_of(KmpdfTool::XfdfExporter).to receive(:result).and_return({
                                                                                      "stage_1" => "content",
                                                                                      "stage_2" => "content"
                                                                                    })

      @signer = FactoryBot.create(:member_a)
      @template = FactoryBot.create(:template, owner: @member, dummy_stage_count: 2)
      @template.dummy_stages.first.update(sequence: 1)
      @template.dummy_stages.second.update(sequence: 2)
      @params = {
        "file_name": "create_and_invite",
        "stages": [
          {
            "email": @signer.email,
            "name": @signer.name,
            "role": @template.dummy_stages.first.actor_info["role"],
            "verify": [
              {
                "verify_type": "email",
                "occassion": "sign",
                "sequence": 1
              }
            ]
          },
          {
            "email": @signer.email,
            "name": @signer.name,
            "role": @template.dummy_stages.second.actor_info["role"],
            "verify": [
              {
                "verify_type": "email",
                "occassion": "read",
                "sequence": 1
              }
            ]
          }
        ],
        "receiver_lang": "en",
        "forget_remind": false,
        "with_sign_url": true,
        "need_ca": false,
        "client": "web",
        "ip_address": "211.22.240.100"
      }
    end

    it 'should return 200 and get task info', rpdoc_example_key: 200, rpdoc_example_name: 'create task from template_id success' do
      @params[:template_id] = @template.id

      post "#{@path}/create_from_template", params: @params.to_json, headers: @headers

      expect(response).to have_http_status(200)
      expect(json['data']['file_name']).to eq(@params[:file_name])
      expect(json['data']['sign_type']).to eq('create_and_invite')
      expect(json['data']['has_order']).to eq(@template.has_order?)
      expect(json['data']['status']).to eq('waiting')
      expect(json['data']['current_member_turn']).to eq(false)
      expect(json['data']['own_by_me']).to eq(true)
      json['data']['stage_infos'].each do |stage|
        expect(stage['sign_url']).to be_present
      end
    end

    it 'should return 200 and get task info', rpdoc_example_key: 200_2, rpdoc_example_name: 'create task from template_code success' do
      @params[:template_code] = @template.code

      post "#{@path}/create_from_template", params: @params.to_json, headers: @headers

      expect(response).to have_http_status(200)
      expect(json['data']['file_name']).to eq(@params[:file_name])
      expect(json['data']['sign_type']).to eq('create_and_invite')
      expect(json['data']['has_order']).to eq(@template.has_order?)
      expect(json['data']['status']).to eq('waiting')
      expect(json['data']['current_member_turn']).to eq(false)
      expect(json['data']['own_by_me']).to eq(true)
    end

    it 'should return 200 and get task info', rpdoc_example_key: 200_3, rpdoc_example_name: 'create task add otp success' do
      @params = {
        'template_code': @template.code,
        'member_id': @member.id,
        'file_name': 'create_and_invite',
        'stages': [
          {
            'email': @signer.email,
            'name': @signer.name,
            'role': @template.dummy_stages.first.actor_info['role'],
            'verify': [
              {
                "verify_type": "email",
                "occassion": "sign",
                "sequence": 1
              },
              {
                "verify_type": "sms",
                "verify_source": "+88663131660",
                "occassion": "sign",
                "sequence": 1
              }
            ]
          },
          {
            'email': @signer.email,
            'name': @signer.name,
            'role': @template.dummy_stages.second.actor_info['role'],
            'verify': [
              {
                "verify_type": "email",
                "occassion": "sign",
                "sequence": 1
              },
              {
                "verify_type": "sms",
                "verify_source": "+88612345678",
                "occassion": "sign",
                "sequence": 1
              }
            ]
          }
        ],
        'client': 'web',
        'ip_address': '211.22.240.100'
      }
      post "#{@path}/create_from_template", params: @params.to_json, headers: @headers

      expect(response).to have_http_status(200)
      expect(json['data']['file_name']).to eq(@params[:file_name])
      expect(json['data']['sign_type']).to eq('create_and_invite')
      expect(json['data']['has_order']).to eq(@template.has_order?)
      expect(json['data']['status']).to eq('waiting')
      expect(json['data']['current_member_turn']).to eq(false)
      expect(json['data']['own_by_me']).to eq(true)
    end

    it 'should return 200 and inherit custom_message_setting from template', rpdoc_example_key: 200_6, rpdoc_example_name: 'create task from template with custom_message_setting' do
      @template.dummy_stages.first.update(custom_message_setting: { 'processing_viewable' => true, 'completed_viewable' => false })
      @template.dummy_stages.second.update(custom_message_setting: { 'processing_viewable' => false, 'completed_viewable' => true })
      @params[:template_id] = @template.id

      post "#{@path}/create_from_template", params: @params.to_json, headers: @headers
      
      expect(response).to have_http_status(200)

      first_stage = json['data']['stage_infos'].find { |stage| stage['sequence'] == 1 }
      second_stage = json['data']['stage_infos'].find { |stage| stage['sequence'] == 2 }
      expect(first_stage['custom_message_setting']).to eq({ 'processing_viewable' => true, 'completed_viewable' => false })
      expect(second_stage['custom_message_setting']).to eq({ 'processing_viewable' => false, 'completed_viewable' => true })
    end


    it 'should return 200 and custom_message_setting', rpdoc_example_key: 200_7, rpdoc_example_name: 'create task from template with custom_message_setting' do
      @params[:stages][0][:custom_message_setting] = {'processing_viewable' => true, 'completed_viewable' => false}
      @params[:stages][1][:custom_message_setting] = {'processing_viewable' => false, 'completed_viewable' => false}
      @params[:template_id] = @template.id

      post "#{@path}/create_from_template", params: @params.to_json, headers: @headers
      
      expect(response).to have_http_status(200)

      first_stage = json['data']['stage_infos'].find { |stage| stage['sequence'] == 1 }
      second_stage = json['data']['stage_infos'].find { |stage| stage['sequence'] == 2 }
      expect(first_stage['custom_message_setting']).to eq({ 'processing_viewable' => true, 'completed_viewable' => false })
      expect(second_stage['custom_message_setting']).to eq({ 'processing_viewable' => false, 'completed_viewable' => false })
    end

    it 'should return 200 and get task info', rpdoc_example_key: 200_4, rpdoc_example_name: 'create task from template and change base pdf success' do
      original_file = File.read("#{Rails.root}/spec/fixtures/files/test.pdf")
      allow_any_instance_of(ServiceFile).to receive_message_chain(:file, :attached?).and_return(true)
      allow_any_instance_of(ServiceFile).to receive_message_chain(:file, :download).and_return(original_file)
      change_file = open("#{Rails.root}/spec/fixtures/files/test-2.pdf")
      mock_upload
      mock_file_processing_service
      mock_service(KmpdfTool::XfdfExporter, working_dir: Dir.mktmpdir)

      @params[:template_code] = @template.code
      @params[:file] = Base64.strict_encode64(change_file.read)
      post "#{@path}/create_from_template", params: @params.to_json, headers: @headers

      expect(response).to have_http_status(200)
      expect(json['data']['file_name']).to eq(@params[:file_name])
      expect(json['data']['sign_type']).to eq('create_and_invite')
      expect(json['data']['has_order']).to eq(@template.has_order?)
      expect(json['data']['status']).to eq('waiting')
      expect(json['data']['current_member_turn']).to eq(false)
      expect(json['data']['own_by_me']).to eq(true)
    end

    it 'should return 400 and get task info', rpdoc_example_key: 400, rpdoc_example_name: 'create task from template and change base pdf fail' do
      original_file = File.read("#{Rails.root}/spec/fixtures/files/test-2.pdf")
      allow_any_instance_of(ServiceFile).to receive_message_chain(:file, :attached?).and_return(true)
      allow_any_instance_of(ServiceFile).to receive_message_chain(:file, :download).and_return(original_file)
      change_file = open("#{Rails.root}/spec/fixtures/files/test.pdf")
      mock_upload
      mock_file_processing_service
      mock_service(KmpdfTool::XfdfExporter, working_dir: Dir.mktmpdir)

      @params[:template_code] = @template.code
      @params[:file] = Base64.strict_encode64(change_file.read)
      post "#{@path}/create_from_template", params: @params.to_json, headers: @headers
      expect(response).to have_http_status(400)
      expect(json['error_code']).to eq(4001311)
      expect(json['error_key']).to eq('not_enough_pages')
    end

  end
end
