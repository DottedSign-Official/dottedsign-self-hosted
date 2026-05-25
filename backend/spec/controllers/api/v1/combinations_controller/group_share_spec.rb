# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Api::V1::CombinationsController, type: :request do
  include_context 'rpdoc'

  before(:each) do |example|
    example.metadata[:rpdoc_action_key] = 'share'
    example.metadata[:rpdoc_action_name] = '分享簽署組合'
    example.metadata[:rpdoc_example_folders] = ['v1', 'combinations']

    @member = mock_member(:member_me)
    @group = mock_group(@member)
    @combination = FactoryBot.create(:combination, owner: @member, group_id: @member.group_id)

    @headers = {
      'Content-Type' => 'application/json',
      'Authorization' => 'Bearer {{rabbit_token}}'
    }
    @path = '/api/v1/combinations/group_share'
  end

  context '#share' do
    before(:each) do
      @params = {
        combination_id: @combination.id,
        group_permission: {
          admin: true,
          manager: true,
          member: false
        }
      }
    end

    it 'should return 200', rpdoc_example_key: 200, rpdoc_example_name: '分享簽署組合成功' do
      post @path, params: @params.to_json, headers: @headers
      expect(response).to have_http_status(200)
      share_detail = @combination.share_detail[:group_share]
      expect(share_detail.present?).to be(true)
      expect(share_detail['admin']).to be(@params[:group_permission][:admin])
      expect(share_detail['manager']).to be(@params[:group_permission][:manager])
      expect(share_detail['member']).to be(@params[:group_permission][:member])
    end

    it 'should share to custom role', rpdoc_skip: true do
      role = create(:role, group: @group)
      @params[:group_permission][role.name] = true
      post @path, params: @params.to_json, headers: @headers
      expect(response).to have_http_status(200)
      share_detail = @combination.share_detail[:group_share]
      expect(share_detail.present?).to be(true)
      expect(share_detail[role.name]).to be(@params[:group_permission][role.name])
    end

    it 'should create 2 share_setting', rpdoc_skip: true do
      expect{post @path, params: @params.to_json, headers: @headers}.to change{ShareSetting.count}.by(2)
    end

    it 'should return 404_048 if combination not found', rpdoc_example_key: 404_048, rpdoc_example_name: '分享簽署組合失敗 (combination not found)' do
      @params[:combination_id] = 0
      post @path, params: @params.to_json, headers: @headers
      expect(response).to have_http_status(404)
      expect(json['error_code']).to eq(404_048)
      expect(json['error_key']).to eq('combination_not_found')
    end

    it 'should return 403_068 if combination not found', rpdoc_example_key: 403_068, rpdoc_example_name: '分享簽署組合失敗 (combination not accessible)' do
      mock_member(:member_a)
      post @path, params: @params.to_json, headers: @headers
      expect(response).to have_http_status(403)
      expect(json['error_code']).to eq(403_068)
      expect(json['error_key']).to eq('combination_not_accessible')
    end
  end
end
