require 'rails_helper'

RSpec.shared_examples "[reissue] a task with an unissueable state" do |task_state|
  it "#{task_state} task" do
    @task.send("#{task_state}!")  # Dynamically call the task method

    post @path, params: @params.to_json, headers: @headers
    expect(response).to have_http_status(400)
    expect(json['error_code']).to eq(error_code)
  end
end

RSpec.shared_examples "[reissue] a stage with an unissueable state" do |stage_state|
  it "#{stage_state} stage" do
    @stage.send("#{stage_state}!")  # Dynamically call the stage method

    post @path, params: @params.to_json, headers: @headers
    expect(response).to have_http_status(400)
    expect(json['error_code']).to eq(error_code)
  end
end

RSpec.describe Api::V1::SignTasks::SignController, type: :request do
  include_context 'rpdoc'

  before(:each) do |example|
    example.metadata[:rpdoc_action_key] = 'reissue'
    example.metadata[:rpdoc_action_name] = '重新發送簽署階段'
    example.metadata[:rpdoc_example_folders] = ['v1', 'sign_tasks', 'sign']

    allow_any_instance_of(KmpdfTool::XfdfExporter).to receive(:result).and_return({
      "stage_1" => "content",
      "stage_2" => "content"
    })
    @headers = {
      'Authorization' => 'Bearer {{rabbit_token}}',
      'Content-Type' => 'application/json'
    }
    @path = '/api/v1/sign_tasks/reissue'
  end

  describe 'quick signer reissue' do
    before(:each) do
      @task = FactoryBot.create(:quick_sign_task)
      @stage = @task.sign_stages.first
      @stage.processing_file_failed!
      @params = {
        sign_task_id: @task.id,
        stage_id: @stage.id
      }
    end

    it 'request with code should return 200', rpdoc_example_key: 200, rpdoc_example_name: 'reissue task with code success' do
      code = @task.original_file.preview_code(@stage, will_expired: true)
      params = { code: code }
      headers = { 'Content-Type' => 'application/json' }
      # read API get task id and stage id
      post @path, params: params.to_json, headers: headers
      @task.reload
      @stage.reload

      expect(response).to have_http_status(200)
      expect(@task.status).to eq('waiting')
      expect(@stage.status).to eq('processing')
      expect(@task.sign_events.last.action_name).to eq('reissue')
    end
  end

  describe 'member reissue' do
    before(:each) do
      @member = mock_member(:member_me)
      @group = mock_group(@member, role: 'member')
      @task = FactoryBot.create(:a_file_failed_task)
      @stage = @task.sign_stages.first
      @params = {
        sign_task_id: @task.id,
        stage_id: @stage.id
      }
    end
    # include_examples "[reissue] a task with an unissueable state"
    # include_examples "[reissue] a stage with an unissueable state"

    it 'should return 200', rpdoc_example_key: 200, rpdoc_example_name: 'reissue task success' do
      post @path, params: @params.to_json, headers: @headers
      @task.reload
      @stage.reload

      expect(response).to have_http_status(200)
      expect(@task.status).to eq('waiting')
      expect(@stage.status).to eq('processing')
      expect(@task.sign_events.last.action_name).to eq('reissue')
    end

    it "should return 200 when member is admin", rpdoc_example_key: 200_1, rpdoc_example_name: 'group admin reissue task success' do
      mock_group(mock_member(:member_a), role: 'admin')
      post @path, params: @params.to_json, headers: @headers
      @task.reload
      @stage.reload

      expect(response).to have_http_status(200)
      expect(@task.status).to eq('waiting')
      expect(@stage.status).to eq('processing')
      expect(@task.sign_events.last.action_name).to eq('reissue')
    end

    it "should return 403 when member isn't signer and admin", rpdoc_example_key: 403, rpdoc_example_name: 'reissue task failed' do
      mock_group(mock_member(:member_b), role: 'member')
      post @path, params: @params.to_json, headers: @headers
      expect(response).to have_http_status(403)
      expect(json['error_code']).to eq(403036)
    end

    context ">> task not issueable" do
      let(:error_code) { 400922 }
      ["draft", "completed", "expired", "declined"].each do |task_state|
        include_examples "[reissue] a task with an unissueable state", task_state
      end
    end

    context ">> stage not issueable" do
      let (:error_code) { 400923 }
      ['initial', 'processing', 'done', 'declined', 'canceled', 'processing_file'].each do |stage_state|
        include_examples "[reissue] a stage with an unissueable state", stage_state
      end
    end
  end

end