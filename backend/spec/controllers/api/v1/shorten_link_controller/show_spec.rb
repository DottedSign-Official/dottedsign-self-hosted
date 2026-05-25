require 'rails_helper'

RSpec.describe Api::V1::ShortenLinkController, type: :request do
  include_context 'redis_cache'
  include_context 'rpdoc'

  before(:each) do |example|
    example.metadata[:rpdoc_action_key] = 'show'
    example.metadata[:rpdoc_action_name] = '查詢短網址'
    example.metadata[:rpdoc_example_folders] = ['v1', 'shorten_link']
  end

  describe '#shorten_link' do
    before(:each) do |example|
      @target_url = 'https://dottedsign.preparing.test.com/zh-tw/mobile-sign-panel?uid=1112ba06-d926-467b-a2f9-8f3db6b70bbe&id=6447&token=FG_RTXbk2T3mOZANoEToKMq8wAxJ7zPGKyrUxoo6XeI&category=initial'
      uuid = SecureRandom.uuid
      Rails.cache.write("shorten_link:#{uuid}", @target_url, expires_in: 30.minutes) unless example.metadata[:skip_write_cache]

      @path = "/api/v1/shorten_link/#{uuid}"
    end

    it 'should return 200', rpdoc_example_key: 200, rpdoc_example_name: 'query shorten link success' do
      get @path

      expect(response).to have_http_status(200)
      expect(json['data']['target_url']).to eq(@target_url)
    end

    it 'should return 400', skip_write_cache: true, rpdoc_example_key: 200, rpdoc_example_name: 'query shorten link failed' do
      get @path

      expect(response).to have_http_status(404)
      expect(json['error_key']).to eq('shorten_link_not_found')
      expect(json['error_code']).to eq(404_047)
    end
  end
end
