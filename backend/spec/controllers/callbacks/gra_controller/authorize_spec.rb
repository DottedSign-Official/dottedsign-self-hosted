require 'rails_helper'

RSpec.describe Callbacks::GraController, type: :request do
  include_context 'rpdoc'

  before(:each) do |example|
    example.metadata[:rpdoc_action_key] = 'authorize'
    example.metadata[:rpdoc_action_name] = 'gra authorize success callback'
    example.metadata[:rpdoc_example_folders] = ['callbacks', 'gra', 'authorize']
    mock_hsm_secret_key

    @headers = {
      'Content-Type' => 'application/json'
    }
    @path = '/callbacks/gra/authorize'
  end

  describe '#authorize' do
    before(:each) do
      @params = {
        result: 1,
        resultMessage: "成功執行操作",
        email: "fredfan@cht.com.tw",
        expDate: "20221218180000",
        tid: "c6ae0ea3-8a75-4d69-b270-723e4e2cdcc7"
      }
    end

    it 'should return 200', rpdoc_example_key: 200, rpdoc_example_name: 'get ca auth result success' do
      post @path, params: @params.to_json, headers: @headers
      expect(response).to have_http_status(200)
    end
  end

end
