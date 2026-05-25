require 'rails_helper'

RSpec.describe Api::V1::ShortenLinkController, type: :request do
  include_context 'redis_cache'
  include_context 'rpdoc'

  before(:each) do |example|
    example.metadata[:rpdoc_action_key] = 'create'
    example.metadata[:rpdoc_action_name] = '創建短網址'
    example.metadata[:rpdoc_example_folders] = ['v1', 'shorten_link']

    @member = mock_member(:member_me)
    @headers = {
      'Authorization' => 'Bearer {{rabbit_token}}',
      'Content-Type' => 'application/json'
    }
  end

  describe '#shorten_link' do
    before(:each) do
      @path = '/api/v1/shorten_link'
      @params = {
        target_url: 'https://dottedsign.preparing.test.com/zh-tw/mobile-sign-panel?uid=1112ba06-d926-467b-a2f9-8f3db6b70bbe&id=6447&token=FG_RTXbk2T3mOZANoEToKMq8wAxJ7zPGKyrUxoo6XeI&category=initial'
      }
    end

    it 'should return 200 and write value to redis', rpdoc_example_key: 200, rpdoc_example_name: 'create shorten link success' do
      post @path, params: @params.to_json, headers: @headers
      expect(response).to have_http_status(200)
      shorten_link = json['data']['shorten_link']
      uuid = shorten_link.split('/').last
      expect(Rails.cache.read("shorten_link:#{uuid}")).to eq(@params[:target_url])
    end
  end
end
