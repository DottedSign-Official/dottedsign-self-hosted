# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Api::V1::CombinationsController, type: :request do
  include_context 'rpdoc'

  before(:each) do |example|
    example.metadata[:rpdoc_action_key] = 'update'
    example.metadata[:rpdoc_action_name] = '修改簽署組合'
    example.metadata[:rpdoc_example_folders] = ['v1', 'combinations']

    @member = mock_member(:member_me)
    mock_group(@member)
    @combination = FactoryBot.create(:combination, owner: @member, group_id: @member.group_id)

    @headers = {
      'Content-Type' => 'application/json',
      'Authorization' => 'Bearer {{rabbit_token}}'
    }
    @path = "/api/v1/combinations/#{@combination.id}"
  end

  context '#update' do
    before(:each) do
      @params = {
        name: 'Test Combination',
        description: 'This is combination',
        stages: [
          {
            name: 'Stage 1',
            email: 'test1@kdanmobile.com',
            verify: [{
              occasion: 'sign',
              verify_type: 'email'
            }]
          },
          {
            name: 'Stage 2',
            stage_setting: {
              forward_enable: true,
              decline_enable: false
            },
            verify: [{
              verify_type: 'sms',
              verify_source: '+886-912345678'
            }]
          }
        ]
      }
    end

    it 'should return 200', rpdoc_example_key: 200, rpdoc_example_name: '修改簽署組合成功' do
      put @path, params: @params.to_json, headers: @headers
      expect(response).to have_http_status(200)
      expect(json['data']['details'].length).to eq(@params[:stages].length)
      # expect(json['data']['details'][1]['verify'][0]['verify_type']).to eq('sms')
      # expect(json['data']['details'][1]['verify'][0]['verify_source']).to eq('+886-912345678')
    end

    it 'should return 200 for rename', rpdoc_example_key: 200, rpdoc_example_name: '修改簽署組合成功 (rename)' do
      params = {
        name: 'New Combination Name'
      }
      put @path, params: params.to_json, headers: @headers
      expect(response).to have_http_status(200)
      expect(json['data']['name']).to eq(params[:name])
    end

    it 'should return 404_048 if combination not found', rpdoc_example_key: 404_048, rpdoc_example_name: '修改簽署組合失敗 (combination not found)' do
      path = "/api/v1/combinations/0"
      put path, params: @params.to_json, headers: @headers
      expect(response).to have_http_status(404)
      expect(json['error_code']).to eq(404_048)
      expect(json['error_key']).to eq('combination_not_found')
    end
  end
end
