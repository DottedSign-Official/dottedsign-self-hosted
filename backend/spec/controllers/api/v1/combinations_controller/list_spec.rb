# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Api::V1::CombinationsController, type: :request do
  include_context 'rpdoc'

  before(:each) do |example|
    example.metadata[:rpdoc_action_key] = 'list'
    example.metadata[:rpdoc_action_name] = '取得簽署組合列表'
    example.metadata[:rpdoc_example_folders] = ['v1', 'combinations']

    @member = mock_member(:member_me)
    mock_group(@member)
    5.times { FactoryBot.create(:combination, owner: @member, group_id: @member.group_id) }

    @headers = {
      'Content-Type' => 'application/json',
      'Authorization' => 'Bearer {{rabbit_token}}'
    }
    @path = "/api/v1/combinations/list"
  end

  context '#list' do
    before(:each) do
      @params = {
        page: 1,
        per_page: 10
      }
    end

    it 'should return 200', rpdoc_example_key: 200, rpdoc_example_name: 'list combinations success' do
      get "#{@path}?#{URI.encode_www_form(@params)}", headers: @headers
      expect(response).to have_http_status(200)
      expect(json['data']['combinations'].length).to eq(5)
    end

    it 'should increase combination list num if create a new form', rpdoc_skip: true do
      FactoryBot.create(:combination, owner: @member, group_id: @member.group_id)
      get "#{@path}?#{URI.encode_www_form(@params)}", headers: @headers
      expect(json['data']['combinations'].length).to eq(6)
    end

    it 'should get 0 combination list num if quantity 4', rpdoc_skip: true do
      @params[:quantity] = 4
      get "#{@path}?#{URI.encode_www_form(@params)}", headers: @headers
      expect(json['data']['combinations'].length).to eq(0)
    end

    it 'should get no combination if member kick out of group', rpdoc_skip: true do
      mock_group_kick(@member)
      get "#{@path}?#{URI.encode_www_form(@params)}", headers: @headers
      expect(json['data']['combinations'].length).to eq(0)
    end
  end
end
