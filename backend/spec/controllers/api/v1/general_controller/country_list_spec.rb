require 'rails_helper'

RSpec.describe Api::V1::GeneralController, type: :request do
  include_context 'rpdoc'

  before(:each) do |example|
    example.metadata[:rpdoc_action_key] = 'country_list'
    example.metadata[:rpdoc_action_name] = 'get country list'
    example.metadata[:rpdoc_example_folders] = ['v1', 'general']

    mock_member(:member_me)
    @headers = {
      'Authorization' => 'Bearer {{rabbit_token}}'
    }
    @path = '/api/v1/country_list'
  end

  describe '#country_list' do

    it 'should return 200', rpdoc_example_key: 200, rpdoc_example_name: 'get country list success' do
      get @path, headers: @headers
      expect(response).to have_http_status(200)
      expect(json['data'].length).to eq(CountryInfo.count)
    end
  end
end
