require 'rails_helper'

RSpec.describe Api::V1::SignTasks::InfoController, type: :request do
  include_context 'rpdoc'

  before(:each) do |example|
    example.metadata[:rpdoc_action_key] = 'read_from_preview_share_link'
    example.metadata[:rpdoc_action_name] = 'read form preview share link task'
    example.metadata[:rpdoc_example_folders] = ['v1', 'sign_tasks', 'info']

    @headers = {
      'Content-Type' => 'application/json',
      'User-Agent' => 'RSpec',
    }
    @path = '/api/v1/sign_tasks/read_from_preview_share_link'
  end

  describe '#read_from_preview_share_link' do
    context '[sign task]' do
      before(:each) do |example|
        @member = mock_member(:member_me, skip_auth: example.metadata[:skip_auth])
        @task = FactoryBot.create(:waiting_for_me1)
        link = @task.preview_share_link(false)
        code = CGI.parse(URI.parse(link).query)['code'].first
        @params = {
          code: code
        }
      end

      it 'should return 200 if read task success', rpdoc_example_key: 200, rpdoc_example_name: 'read task success' do
        get(@path, params: @params, headers: @headers)
        expect(response).to have_http_status(200)
        expect(json['data']['file_name']).to eq(@task.file_name)
        expect(json['data']['has_order']).to eq(@task.has_order)
        expect(json['data']['status']).to eq('waiting')
        expect(json['data']['stage_infos'].count).to eq(@task.stages.length)
        expect(json['data']['task_owner_info']['name']).to eq('Me')
        expect(json['data']['task_owner_info']['status']).to eq('send')
        expect(json['data']['decline_reasons']).to be_a(Array)
        expect(json['data']['download_link']).to_not be_nil
        stage = @task.stages[0]
        expect(json['data']['stage_infos'][0]['email']).to eq(stage.email)
        expect(json['data']['stage_infos'][0]['action_type']).to eq(stage.status)
        expect(json['data']['decline_reasons']).to be_a(Array)
        expect(json['data']['image_info']['images']).to be_a(Array)
      end

      it 'should return 400 if read task fail', rpdoc_example_key: 400, rpdoc_example_name: 'read task fail' do
        @params[:code] = "test"
        get(@path, params: @params, headers: @headers)
        expect(response).to have_http_status(400)
        expect(json['error_code']).to eq(400061)
        expect(json['error_key']).to eq('invalid_preview_code')
      end

      it 'should return 400 if read task fail', rpdoc_example_key: 404, rpdoc_example_name: 'task not found' do
        link_info = { task_id: 999 }
        link_info[:expired_at] = Time.zone.now.to_i + ServiceFile::PREVIEW_EXPIRED_IN
        code = JWT.encode(link_info, Secrets.jwt.secret, Secrets.jwt.encode_algorithm)
        @params[:code] = code
        get(@path, params: @params, headers: @headers)
        expect(response).to have_http_status(404)
        expect(json['error_code']).to eq(404031)
        expect(json['error_key']).to eq('task_not_found')
      end

      it 'should return 200 if read task success to super admin ', rpdoc_example_key: 200_2, rpdoc_example_name: 'read task success for sign task id' do
        mock_developer
        double = double("AccessToken", resource_owner_id: @member.id)
        allow(Doorkeeper::AccessToken).to receive(:find_by_token).and_return(double)
        @headers = {
          'User-Agent' => 'RSpec',
          'Authorization' => 'Bearer {{rabbit_token}}',
        }
        @params = {
          sign_task_id: @task.id
        }
        get(@path, params: @params, headers: @headers)
        expect(response).to have_http_status(200)
      end

      it 'should return 400 because need super admin', rpdoc_example_key: 400_2, rpdoc_example_name: 'read task fail for sign task id' do
        double = double("AccessToken", resource_owner_id: @member.id)
        allow(Doorkeeper::AccessToken).to receive(:find_by_token).and_return(double)
        @headers = {
          'User-Agent' => 'RSpec',
          'Authorization' => 'Bearer {{rabbit_token}}',
        }
        @params = {
          sign_task_id: @task.id
        }
        get(@path, params: @params, headers: @headers)
        expect(response).to have_http_status(400)
      end
    end

    context '[envelope]' do
      before(:each) do |example|
        @member = mock_member(:member_me, skip_auth: example.metadata[:skip_auth])
        @envelope = FactoryBot.create(:waiting_for_me_envelope)
        link = @envelope.preview_share_link(false)
        code = CGI.parse(URI.parse(link).query)['code'].first
        @params = {
          code: code
        }
      end

      it 'should return 200 if read envelope success', rpdoc_example_key: 200_3, rpdoc_example_name: 'read envelope success' do
        get(@path, params: @params, headers: @headers)
        expect(response).to have_http_status(200)
        expect(json['data']['envelope_name']).to eq(@envelope.envelope_name)
        expect(json['data']['has_order']).to eq(@envelope.has_order)
        expect(json['data']['status']).to eq('waiting')
        expect(json['data']['stage_infos'].length).to eq(@envelope.stages.length)
        @envelope.sign_tasks.reload
        expect(json['data']['task_infos'].length).to eq(@envelope.sign_tasks.length)
        expect(json['data']['envelope_owner_info']['name']).to eq('Me')
        expect(json['data']['envelope_owner_info']['status']).to eq('send')
        expect(json['data']['decline_reasons']).to be_a(Array)
        expect(json['data']['download_link']).to_not be_nil
        stage = @envelope.stages[0]
        expect(json['data']['stage_infos'][0]['email']).to eq(stage.email)
        expect(json['data']['stage_infos'][0]['action_type']).to eq(stage.status)
        expect(json['data']['decline_reasons']).to be_a(Array)
        expect(json['data']['image_info']['images']).to be_a(Array)
      end

      it 'should return 200 if read envelope success to super admin ', rpdoc_example_key: 200_4, rpdoc_example_name: 'read envelope success for envelope id' do
        mock_developer
        double = double("AccessToken", resource_owner_id: @member.id)
        allow(Doorkeeper::AccessToken).to receive(:find_by_token).and_return(double)
        @headers = {
          'User-Agent' => 'RSpec',
          'Authorization' => 'Bearer {{rabbit_token}}',
        }
        @params = {
          envelope_id: @envelope.id
        }
        get(@path, params: @params, headers: @headers)
        expect(response).to have_http_status(200)
      end

      it 'should return 400061 if read envelope fail', rpdoc_example_key: 400061, rpdoc_example_name: 'read envelope fail' do
        @params[:code] = "test"
        get(@path, params: @params, headers: @headers)
        expect(response).to have_http_status(400)
        expect(json['error_code']).to eq(400061)
        expect(json['error_key']).to eq('invalid_preview_code')
      end

      it 'should return 404048 if read envelope fail', rpdoc_example_key: 404048, rpdoc_example_name: 'envelope not found' do
        link_info = { envelope_id: 999 }
        link_info[:expired_at] = Time.zone.now.to_i + ServiceFile::PREVIEW_EXPIRED_IN
        code = JWT.encode(link_info, Secrets.jwt.secret, Secrets.jwt.encode_algorithm)
        @params[:code] = code
        get(@path, params: @params, headers: @headers)
        expect(response).to have_http_status(404)
        expect(json['error_code']).to eq(404048)
        expect(json['error_key']).to eq('envelope_not_found')
      end
    end
  end
end
