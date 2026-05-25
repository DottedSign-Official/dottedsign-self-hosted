# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Api::V1::CombinationsController, type: :request do
  include_context 'rpdoc'

  before(:each) do |example|
    example.metadata[:rpdoc_action_key] = 'share_info'
    example.metadata[:rpdoc_action_name] = '取得簽署組合分享資訊'
    example.metadata[:rpdoc_example_folders] = ['v1', 'combinations']

    @member = mock_member(:member_me)
    @group = mock_group(@member)
    @combination = FactoryBot.create(:combination, owner: @member, group_id: @member.group_id)

    @headers = {
      'Content-Type' => 'application/json',
      'Authorization' => 'Bearer {{rabbit_token}}'
    }
    @path = '/api/v1/combinations/share_info'
  end

  context '#share_info' do
    before(:each) do
      @params = {
        combination_id: @combination.id
      }
    end

    it 'should return 200', rpdoc_example_key: 200, rpdoc_example_name: '取得簽署組合分享資訊成功' do
      get "#{@path}?#{URI.encode_www_form(@params)}", headers: @headers
      expect(response).to have_http_status(200)
      expect(json['data']).to have_key('group_share')
    end

    it 'should return 404_048 if combination not found', rpdoc_example_key: 404_048, rpdoc_example_name: '取得簽署組合分享資訊失敗 (combination not found)' do
      @params[:combination_id] = 0
      get "#{@path}?#{URI.encode_www_form(@params)}", headers: @headers
      expect(response).to have_http_status(404)
      expect(json['error_code']).to eq(404_048)
      expect(json['error_key']).to eq('combination_not_found')
    end
  end
end
