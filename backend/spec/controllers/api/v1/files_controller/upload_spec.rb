require 'rails_helper'

RSpec.describe Api::V1::FilesController, type: :request do
  include_context 'rpdoc'

  before(:each) do |example|
    example.metadata[:rpdoc_action_key] = 'upload'
    example.metadata[:rpdoc_action_name] = 'upload file'
    example.metadata[:rpdoc_example_folders] = ['v1', 'files']

    @member = mock_member(:member_me, skip_auth: example.metadata[:skip_auth])
    @file = FactoryBot.create(:uploaded_file, storable: @member, label: 'avatar')
    @headers = {'Content-Type' => 'multipart/form-data'}
    @path = "/api/v1/files/upload/#{@file.upload_code}"
    mock_upload
  end

  describe '#upload' do
    before(:each) do
      @params = { file: fixture_file_upload('test.pdf', 'application/pdf') }
    end

    it 'should return 200 if upload success', rpdoc_example_key: 200, rpdoc_example_name: 'upload file success' do
      post @path, params: @params, headers: @headers
      expect(response).to have_http_status(200)
    end

    it 'should get same service_file id as file id', rpdoc_example_key: 400_057, rpdoc_example_name: 'upload file failed(invalid file type)' do
      @params[:file] = fixture_file_upload('test.txt', 'text/plain')

      post @path, params: @params, headers: @headers
      expect(response).to have_http_status(400)
      expect(json['error_code']).to eq(400_057)
      expect(json['error_key']).to eq('invalid_file_type')
    end

    it 'should get same service_file id as file id', rpdoc_skip: true do
      post @path, params: @params, headers: @headers
      expect(assigns(:service_file)).to eq(@file)
    end
  end
end
