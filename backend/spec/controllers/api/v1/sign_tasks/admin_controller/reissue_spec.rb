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

RSpec.describe Api::V1::SignTasks::AdminController, type: :request do
  include_context 'rpdoc'

  before(:each) do |example|
    example.metadata[:rpdoc_action_key] = 'reissue'
    example.metadata[:rpdoc_action_name] = '重新發送簽署階段'
    example.metadata[:rpdoc_example_folders] = ['v1', 'sign_tasks', 'admin']
    allow_any_instance_of(KmpdfTool::XfdfExporter).to receive(:result).and_return({
      "stage_1" => "content",
      "stage_2" => "content"
    })

    @member = mock_member(:member_me)
    @group = mock_group(@member, role: 'admin')
    @task = FactoryBot.create(:a_file_failed_task)
    @stage = @task.sign_stages.first

    @headers = {
      'Authorization' => 'Bearer {{rabbit_token}}',
      'Content-Type' => 'application/json'
    }
  end

  describe '#tasks' do
    before(:each) do
      @path = '/api/v1/sign_tasks/admin/reissue'
      @params = {
        group_id: @group.id,
        sign_task_id: @task.id,
        stage_id: @stage.id
      }
    end

    it 'should return 200', rpdoc_example_key: 200, rpdoc_example_name: 'reissue task success' do
      post @path, params: @params.to_json, headers: @headers
      expect(response).to have_http_status(200)

      @task.reload
      @stage.reload

      expect(@task.status).to eq('waiting')
      expect(@stage.status).to eq('processing')
      expect(@task.sign_events.last.action_name).to eq('reissue')
    end

    context ">> member isn't group admin" do
      it "should return 403 when member isn't admin", rpdoc_example_key: 403, rpdoc_example_name: 'reissue task failed' do
        mock_group(mock_member(:member_a), role: 'member')
        post @path, params: @params.to_json, headers: @headers
        expect(response).to have_http_status(403)
        expect(json['error_code']).to eq(403056)
      end
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