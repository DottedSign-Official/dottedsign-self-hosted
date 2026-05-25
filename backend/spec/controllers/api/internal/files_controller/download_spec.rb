require 'rails_helper'

RSpec.describe Api::Internal::FilesController, type: :request do
  include_context 'rpdoc'

  before(:each) do |example|
    example.metadata[:rpdoc_action_key] = 'download'
    example.metadata[:rpdoc_action_name] = 'download file'
    example.metadata[:rpdoc_example_folders] = ['internal', 'files']

    @member = mock_member(:member_me, skip_auth: example.metadata[:skip_auth])
    @file = FactoryBot.create(:uploaded_file, storable: @member, label: 'avatar')
    @path = "/api/internal/files/download/#{@file.download_code}"
    mock_download
  end

  describe '#download' do
    before(:each) do
      @params = {attach_type: 'file'}
    end

    it 'should return 200 if download success', rpdoc_example_key: 200, rpdoc_example_name: 'download file success' do
      get "#{@path}?#{URI.encode_www_form(@params)}"
      expect(response).to have_http_status(200)
    end

    it 'should get same service_file id as file id', rpdoc_skip: true do
      get "#{@path}?#{URI.encode_www_form(@params)}"
      expect(assigns(:service_file)).to eq(@file)
    end

    it 'should return 404038 if file not found', rpdoc_example_key: 404038, rpdoc_example_name: 'download file failed (file not found)' do
      @path = "/api/internal/files/download/fake_code"
      get "#{@path}?#{URI.encode_www_form(@params)}"
      expect(response).to have_http_status(404)
      expect(json['error_code']).to eq(404038)
      expect(json['error_key']).to eq('file_not_found')
    end
  end
end
