# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Api::V1::ImagesController, type: :request do
  include_context 'rpdoc'

  before(:each) do |example|
    example.metadata[:rpdoc_action_key] = 'create'
    example.metadata[:rpdoc_action_name] = '建立圖片'
    example.metadata[:rpdoc_example_folders] = ['v1', 'images']

    mock_member(:member_me)
    mock_mini_magick
    file = open("#{Rails.root}/spec/fixtures/files/kdan.png")
    
    @headers = {
      'Content-Type' => 'application/json',
      'Authorization' => 'Bearer {{rabbit_token}}'
    }
    @params = {
      raw: Base64.strict_encode64(file.read)
    }
    @path = "/api/v1/images"
  end

  describe '#create' do
    it 'should return 200', rpdoc_example_key: 200, rpdoc_example_name: '建立圖片成功' do |example|
      post @path, params: @params.to_json, headers: @headers
      expect(response).to have_http_status(200)
      image = Image.last
      expect(json['data']['image_id']).to eq(image.id)
      expect(json['data']['raw']).to eq(@params[:raw])
      expect(json['data']['created_at']).to eq(image.created_at.to_i)
    end
  end
end
