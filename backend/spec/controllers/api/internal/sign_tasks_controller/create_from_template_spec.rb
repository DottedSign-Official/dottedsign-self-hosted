require 'rails_helper'

RSpec.describe Api::Internal::SignTasksController, type: :request do
  include_context 'rpdoc'

  before(:each) do |example|
    example.metadata[:rpdoc_example_folders] = ['internal', 'sign_tasks']
    mock_with_sign_url_enable
    @member = mock_member(:member_me, skip_auth: false)
    @headers = {'Content-Type' => 'application/json'}
    @path = '/api/internal/sign_tasks'
  end

  describe '#create_from_template' do
    before(:each) do |example|
      example.metadata[:rpdoc_action_key] = 'create_from_template'
      example.metadata[:rpdoc_action_name] = '從範本建立任務'
      mock_file_attached

      allow_any_instance_of(KmpdfTool::XfdfExporter).to receive(:result).and_return({
        'stage_1' => 'content',
        'stage_2' => 'content'
      })

      @signer = FactoryBot.create(:member_a)
      @template = FactoryBot.create(:template, owner: @member, dummy_stage_count: 2)
      @template.dummy_stages.first.update(sequence: 1)
      @template.dummy_stages.second.update(sequence: 2)
      @params = {
        'member_id': @member.id,
        'file_name': 'create_and_invite',
        'stages': [
          {
            'email': @signer.email,
            'name': @signer.name,
            'role': @template.dummy_stages.first.actor_info['role']
          },
          {
            'email': @signer.email,
            'name': @signer.name,
            'role': @template.dummy_stages.second.actor_info['role']
          }
        ],
        'client': 'web',
        "need_ca":false,
        'ip_address': '211.22.240.100'
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
      json['data']['stage_infos'].each do |stage|
        expect(stage['sign_url']).to be_present
      end
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
      json['data']['stage_infos'].each do |stage|
        expect(stage['sign_url']).to be_present
      end
    end
  end
end
