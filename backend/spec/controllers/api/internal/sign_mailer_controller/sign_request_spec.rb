# frozen_string_literal: true

require 'rails_helper'

RSpec.describe '/api/internal/sign_mail_controller#sign_request', type: :request do
  include_context 'rpdoc'

  before(:each) do |example|
    example.metadata[:rpdoc_action_key] = 'sign_request'
    example.metadata[:rpdoc_action_name] = '寄送簽名請求信'
    example.metadata[:rpdoc_example_folders] = ['internal', 'mailer', 'sign_mailer', 'sign_request']

    @path = '/api/internal/mailer/sign_request'
    @headers = { 'Content-Type' => 'application/json' }
    @params = {
      email: 'default@rabbit.com',
      user_name: 'testuser',
      sender_email: 'test@test.com',
      sender_name: 'Test',
      doc_name: 'Test File',
      file_link: 'https://www.google.com',
      mail_lang: 'zh-TW'
    }
  end

  it 'should return 200' do |example|
    example.metadata[:rpdoc_example_key] = '200'
    example.metadata[:rpdoc_example_name] = '成功寄送簽名請求信'
    post(@path, params: @params.to_json, headers: @headers)
    expect(response).to have_http_status(200)
  end
end
