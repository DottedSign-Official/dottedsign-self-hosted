require 'rails_helper'

RSpec.describe Api::V1::FilesController, type: :request do
  include_context 'rpdoc'

  before(:each) do |example|
    example.metadata[:rpdoc_action_key] = 'download_attachment'
    example.metadata[:rpdoc_action_name] = 'download attachment file'
    example.metadata[:rpdoc_example_folders] = ['v1', 'files']
    @headers = { 'Authorization' => 'Bearer {{rabbit_token}}' }
    @path = "/api/v1/files/download_attachment/"
    mock_download
  end

  describe '#download_attachment' do
    it 'should return 200 if download attachment success', rpdoc_example_key: 200, rpdoc_example_name: 'download attachment file success' do
      @member = mock_member(:member_me, skip_auth: false)
      @task = FactoryBot.create(:waiting_for_me1)
      @params = {
        file_id: @task.stages[0].service_files[0].id,
      }

      get "#{@path}?#{URI.encode_www_form(@params)}", headers: @headers
      expect(response).to have_http_status(200)
    end

    it 'should return 200 if quick sign download attachment success', rpdoc_example_key: 200, rpdoc_example_name: 'quick sign download attachment file success' do
      @member = mock_member(:member_me, skip_auth: false)
      @quick_sign_task = FactoryBot.create(:quick_sign_completed_task)
      @preview_code = @quick_sign_task.original_file.preview_code(@quick_sign_task.sign_stages.processing.first)
      @params = {
        file_id: @quick_sign_task.stages[0].service_files[0].id,
        code: @preview_code
      }

      get "#{@path}?#{URI.encode_www_form(@params)}", headers: @headers
      expect(response).to have_http_status(200)
    end
  end
end
