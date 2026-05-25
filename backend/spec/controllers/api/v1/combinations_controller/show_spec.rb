# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Api::V1::CombinationsController, type: :request do
  include_context 'rpdoc'

  before(:each) do |example|
    example.metadata[:rpdoc_action_key] = 'show'
    example.metadata[:rpdoc_action_name] = '取得簽署組合資訊'
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

  context '#show' do
    it 'should return 200', rpdoc_example_key: 200, rpdoc_example_name: '取得簽署組合資訊成功' do
      get @path, headers: @headers
      expect(response).to have_http_status(200)
      expect(json['data']['details'].length).to eq(@combination.quantity)
    end

    it 'should return 404_048 if combination not found', rpdoc_example_key: 404_048, rpdoc_example_name: '取得簽署組合資訊失敗 (combination not found)' do
      get '/api/v1/combinations/0', headers: @headers
      expect(response).to have_http_status(404)
      expect(json['error_code']).to eq(404_048)
      expect(json['error_key']).to eq('combination_not_found')
    end

    it 'should return 403_068 if combination not accessible', rpdoc_example_key: 403_068, rpdoc_example_name: '取得簽署組合資訊失敗 (combination not accessible)' do
      member_a = mock_member(:member_a, skip_auth: true)
      combination = FactoryBot.create(:combination, owner: member_a)
      get "/api/v1/combinations/#{combination.id}", headers: @headers
      expect(response).to have_http_status(403)
      expect(json['error_code']).to eq(403_068)
      expect(json['error_key']).to eq('combination_not_accessible')
    end
  end
end
