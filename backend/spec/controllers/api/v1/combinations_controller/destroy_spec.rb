# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Api::V1::CombinationsController, type: :request do
  include_context 'rpdoc'

  before(:each) do |example|
    example.metadata[:rpdoc_action_key] = 'destroy'
    example.metadata[:rpdoc_action_name] = '刪除簽署組合'
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

  context '#destroy' do
    it 'should return 200', rpdoc_example_key: 200, rpdoc_example_name: '刪除簽署組合成功' do
      delete @path, headers: @headers
      expect(response).to have_http_status(200)
    end

    it 'should decrease 1 combination count', rpdoc_skip: true do
      expect { delete @path, headers: @headers }.to change { Combination.count }.by(-1)
    end

    it 'should return 404_048 if combination not found', rpdoc_example_key: 404_048, rpdoc_example_name: '刪除簽署組合失敗 (combination not found)' do
      path = '/api/v1/combinations/0'
      delete path, headers: @headers
      expect(response).to have_http_status(404)
      expect(json['error_code']).to eq(404_048)
      expect(json['error_key']).to eq('combination_not_found')
    end
  end
end
