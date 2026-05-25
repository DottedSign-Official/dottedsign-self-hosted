require 'rails_helper'

RSpec.describe Api::V1::SignTasksController, type: :request do
  include_context 'rpdoc'

  before(:each) do |example|
    example.metadata[:rpdoc_action_key] = 'destroy'
    example.metadata[:rpdoc_action_name] = 'delete task'
    example.metadata[:rpdoc_example_folders] = ['v1', 'sign_tasks']

    @member = mock_member(:member_me, skip_auth: example.metadata[:skip_auth])
    @headers = {
      'Content-Type' => 'application/json',
      'Authorization' => 'Bearer {{rabbit_token}}'
    }
    @task = FactoryBot.create(:waiting_for_me1)
    @path = "/api/v1/sign_tasks/#{@task.id}"
  end

  describe '#destroy' do

    it 'should return 200 and destroy task if task is processing', rpdoc_example_key: 200_1, rpdoc_example_name: 'delete task success (create and invite task)' do
      delete @path, headers: @headers

      @task.reload
      expect(response).to have_http_status(200)
      expect(@task.status).to eq('deleted')
    end

    it 'should destroy task if task is sign and send', rpdoc_example_key: 400003, rpdoc_example_name: 'delete task success (sign and send task)' do
      task = FactoryBot.create(:me_completed_self_task)
      @path = "/api/v1/sign_tasks/#{task.id}"
      delete @path, headers: @headers
      task.reload
      expect(response).to have_http_status(200)
      expect(task.status).to eq('deleted')
    end

    it 'should return 400037 if task is completed', rpdoc_example_key: 400037, rpdoc_example_name: 'delete task failed (task already completed)' do
      task = FactoryBot.create(:completed_task1)
      @path = "/api/v1/sign_tasks/#{task.id}"
      delete @path, headers: @headers
      expect(response).to have_http_status(400)
      expect(json['error_code']).to eq(400037)
    end

    it 'should return 400003 if invalid member', rpdoc_example_key: 400003, rpdoc_example_name: 'delete task failed (invalid member)', skip_auth: true do
      @headers['Authorization'] = 'Bearer invalid-token'
      delete @path, headers: @headers
      expect(response).to have_http_status(400)
      expect(json['error_code']).to eq(400003)
      expect(json['error_key']).to eq('invalid_member')
    end

    context '>> in group' do
      before(:each) do
        FactoryBot.create(:group_member)
        mock_group(@member)
      end

      context '>>> self sender (invite task)' do
        before(:each) do
          @task = FactoryBot.create(:me_sender_waiting_task)
          @path = "/api/v1/sign_tasks/#{@task.id}"
        end

        include_examples 'group_allow_examples', 'delete', 'delete_processing_task', 'self_sender', 200_01
        include_examples 'group_task_forbid_examples', 'delete', 'delete_processing_task', 'self_sender', 403036_01
      end

      context '>>> self sender (self task)' do
        before(:each) do
          @task = FactoryBot.create(:me_completed_self_task)
          @path = "/api/v1/sign_tasks/#{@task.id}"
        end

        include_examples 'group_allow_examples', 'delete', 'delete_sign_and_send_self_task', 'self_signer', 200_02
        include_examples 'group_task_forbid_examples', 'delete', 'delete_sign_and_send_self_task', 'self_signer', 403036_02
      end
    end
  end
end
