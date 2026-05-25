require 'rails_helper'

RSpec.describe Api::V1::SignTasksController, type: :request do
  include_context 'rpdoc'

  before(:each) do |example|
    example.metadata[:rpdoc_action_key] = 'duplicate'
    example.metadata[:rpdoc_action_name] = 'Duplicate a sign task'
    example.metadata[:rpdoc_example_folders] = ['v1', 'sign_tasks']

    @member = mock_member(:member_me)
    @headers = {
      'Authorization' => 'Bearer {{rabbit_token}}',
      'Content-Type' => 'application/json'
    }
    @path = '/api/v1/sign_tasks/duplicate'
  end

  describe '#duplicate' do
    context 'when duplicate success' do
      it 'should return 200 and create draft task with original name', rpdoc_example_key: 200, rpdoc_example_name: 'duplicate task success' do
        task = create(:expired_task4)
        params = { sign_task_id: task.id }
        post @path, params: params.to_json, headers: @headers
        expect(response).to have_http_status(200)

        new_task = SignTask.includes(:sign_stages).find(json['data']['task_id'])
        expect(new_task.file_name).to eq(task.file_name)
        expect(new_task.status).to eq('draft')
        expect(new_task.owner_id).to eq(@member.id)

        sign_stage = new_task.sign_stages.first
        expect(sign_stage.status).to eq('initial')
        expect(sign_stage.sequence).to eq(1)

        review_stage = new_task.sign_stages.second
        expect(review_stage.status).to eq('initial')
        expect(review_stage.sequence).to eq(2)
        expect(review_stage.action).to eq('review')
        expect(review_stage.actor_info['base_stage_id']).to eq(sign_stage.id)
      end

      it 'should return 200 when duplicate form task', rpdoc_skip: true do
        form_task = create(:declined_form_task)
        params = { sign_task_id: form_task.id }
        post @path, params: params.to_json, headers: @headers
        expect(response).to have_http_status(200)

        new_task = SignTask.find_by_id(json['data']['task_id'])
        expect(new_task.create_and_invite?).to be_truthy

        form_stage = form_task.sign_stages.first
        new_stage = new_task.sign_stages.first
        expect(new_stage.action_sign?).to be_truthy
        expect(new_stage.actor_name).to eq(form_stage.actor_info['name'])
        expect(new_stage.email).to eq(form_stage.actor_info['email'])
      end
    end

    context 'when duplicate failed' do
      it 'should return 404_031 when original task is not found', rpdoc_example_key: 404_031_2, rpdoc_example_name: 'duplicate task failed - task not found' do
        params = { sign_task_id: 9999 }
        post @path, params: params.to_json, headers: @headers

        expect(response).to have_http_status(404)
        expect(json['error_code']).to eq(404_031)
        expect(json['error_key']).to eq('task_not_found')
      end

      it 'should return 403_070 when trying to duplicate non-duplicable task', rpdoc_example_key: 403_070, rpdoc_example_name: 'duplicate task failed - task not duplicable' do
        task = create(:draft_task)
        params = { sign_task_id: task.id }
        post @path, params: params.to_json, headers: @headers

        expect(response).to have_http_status(403)
        expect(json['error_code']).to eq(403_070)
        expect(json['error_key']).to eq('task_not_duplicable')
      end

      it 'should return 403_033 when trying to duplicate task not owned', rpdoc_example_key: 403_033, rpdoc_example_name: 'duplicate task failed - no permission' do
        task = create(:expired_task3)
        params = { sign_task_id: task.id }
        post @path, params: params.to_json, headers: @headers

        expect(response).to have_http_status(403)
        expect(json['error_code']).to eq(403_033)
        expect(json['error_key']).to eq('task_not_owned')
      end
    end
  end
end 