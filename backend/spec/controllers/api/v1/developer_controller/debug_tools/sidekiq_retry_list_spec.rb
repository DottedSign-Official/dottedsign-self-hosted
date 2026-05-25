require 'rails_helper'

RSpec.describe Api::V1::DeveloperController, type: :request do
  include_context 'rpdoc'

  before(:each) do |example|
    example.metadata[:rpdoc_action_key] = 'sidekiq_retry_list'
    example.metadata[:rpdoc_action_name] = 'sidekiq retry list'
    example.metadata[:rpdoc_example_folders] = ['v1', 'developer', 'debug_tools']

    mock_developer
    @headers = { 'Authorization' => 'Bearer {{rabbit_token}}', 'Content-Type' => 'application/json' }
    @member = mock_member(:member_me)
    @path = "/api/v1/developer/debug_tools/sidekiq_retry_list"
    @task = FactoryBot.create(:waiting_for_me1)
    @service_file = @task.service_files.first
  end

  describe 'GET #sidekiq_retry_list' do
    let(:worker_name) { 'ReadableFileGeneratorWorker' }
    let(:job) do
      double(
        'Sidekiq Job',
        klass: worker_name,
        args: [@service_file.id, false],
        jid: '123',
        item: { 'error_message' => 'some error' }
      )
    end
    it 'returns a success response with the retry list', rpdoc_example_key: 200, rpdoc_example_name: 'sidekiq_retry_list' do
      allow(Sidekiq::RetrySet).to receive(:new).and_return([job])
      get @path, headers: @headers
      expect(response).to have_http_status(200)
    end

  end
end
