# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Api::V1::CombinationsController, type: :request do
  include_context 'rpdoc'

  before(:each) do |example|
    example.metadata[:rpdoc_action_key] = 'create'
    example.metadata[:rpdoc_action_name] = '建立簽署組合'
    example.metadata[:rpdoc_example_folders] = ['v1', 'combinations']

    @member = mock_member(:member_me)

    @headers = {
      'Content-Type' => 'application/json',
      'Authorization' => 'Bearer {{rabbit_token}}'
    }
    @path = '/api/v1/combinations'
  end

  context '#create' do
    before(:each) do
      @params = {
        name: 'Test Combination',
        description: 'This is combination',
        category: 'dummy_stages',
        stages: [
          {
            name: 'Stage 1',
            email: 'test1@kdanmobile.com'
          },
          {
            name: 'Stage 2',
            stage_setting: {
              forward_enable: true,
              decline_enable: false
            }
          }
        ]
      }
    end

    it 'should return 200' do |example|
      example.metadata[:rpdoc_example_key] = '200'
      example.metadata[:rpdoc_example_name] = '建立簽署組合成功'

      post @path, params: @params.to_json, headers: @headers
      expect(response).to have_http_status(200)
      expect(json['data']['details'].length).to eq(@params[:stages].length)
    end

    it 'should return 400_220 if with invalid email format' do |example|
      example.metadata[:rpdoc_example_key] = '400_220'
      example.metadata[:rpdoc_example_name] = '建立簽署組合失敗 (400_220 with invalid email format)'

      @params[:stages] = [{
        name: 'Invalid Stage',
        email: 'invalid_email_format'
      }]

      post @path, params: @params.to_json, headers: @headers
      expect(response).to have_http_status(400)
      expect(json['error_code']).to eq(400_220)
      expect(json['error_key']).to eq('email_format_invalid')
    end
  end
end
