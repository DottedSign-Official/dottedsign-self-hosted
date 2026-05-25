require 'rails_helper'

RSpec.describe Api::Internal::SignTasksController, type: :request do
  include_context 'rpdoc'

  before(:each) do |example|
    example.metadata[:rpdoc_action_key] = 'download'
    example.metadata[:rpdoc_action_name] = '下載任務檔案'
    example.metadata[:rpdoc_example_folders] = ['internal', 'sign_tasks']

    @path = '/api/internal/sign_tasks/download'
    mock_download
  end
  describe '#download_pdf' do
    before(:each) do
      @task = FactoryBot.create(:completed_task1)
    end

    it 'should return 200-1 if task is completed', rpdoc_example_key: 200-1, rpdoc_example_name: 'get completed pdf base64 success' do
      @params = {
        sign_task_id: @task.id,
        label: 'completed',
        download_type: 'base64'
      }

      get "#{@path}?#{URI.encode_www_form(@params)}"
      expect(response).to have_http_status(200)
    end

    it 'should return 200-2 if task is completed', rpdoc_example_key: 200-2, rpdoc_example_name: 'get completed pdf file success' do
      @params = {
        sign_task_id: @task.id,
        label: 'completed',
        download_type: 'file'
      }

      get "#{@path}?#{URI.encode_www_form(@params)}"
      expect(response).to have_http_status(200)
    end

    it 'should return 200-3 if task is completed', rpdoc_example_key: 200-3, rpdoc_example_name: 'get audit_trail pdf base64 success' do
      @params = {
        sign_task_id: @task.id,
        label: 'audit_trail',
        download_type: 'base64'
      }

      get "#{@path}?#{URI.encode_www_form(@params)}"
      expect(response).to have_http_status(200)
    end

    it 'should return 404', rpdoc_example_key: 404, rpdoc_example_name: 'task not found' do
      @params = {
        sign_task_id: 999,
        label: 'audit_trail',
        download_type: 'base64'
      }

      get "#{@path}?#{URI.encode_www_form(@params)}"
      expect(response).to have_http_status(404)
    end
  end

end
