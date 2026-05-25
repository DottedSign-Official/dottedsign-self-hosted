require 'rails_helper'

RSpec.describe Callbacks::GraController, type: :request do
  include_context 'rpdoc'

  before(:each) do |example|
    example.metadata[:rpdoc_action_key] = 'apply'
    example.metadata[:rpdoc_action_name] = 'gra apply success callback'
    example.metadata[:rpdoc_example_folders] = ['callbacks', 'gra', 'apply']
    mock_hsm_secret_key

    @headers = {
      'Content-Type' => 'application/json'
    }
    @path = '/callbacks/gra/apply'
  end

  describe '#authorize' do
    before(:each) do
      @params = {
        email: "fredfan@cht.com.tw",
        discountCode: "BOOKS001-3PRc",
        whenCreated: "20210126180000",
        certSerial: "9096AB316DA176A7874D5CEA7B9109D9"
      }
    end

    it 'should return 200', rpdoc_example_key: 200, rpdoc_example_name: 'get ca apply result success' do
      post @path, params: @params.to_json, headers: @headers
      expect(response).to have_http_status(200)
    end
  end

end
