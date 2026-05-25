# frozen_string_literal: true

require 'rails_helper'

RSpec.describe '/api/internal/notification_mailer_controller#public_form_compress_download', type: :request do
  include_context 'rpdoc'

  before(:each) do |example|
    example.metadata[:rpdoc_action_key] = 'public_form_compress_download'
    example.metadata[:rpdoc_action_name] = '寄送公開表單下載連接'
    example.metadata[:rpdoc_example_folders] = ['internal', 'mailer', 'notification_mailer', 'notification_mailer']

    @path = '/api/internal/mailer/public_form_compress_download'
    @headers = { 'Content-Type' => 'application/json' }
    @params = {
      email: "default@rabbit.com",
      sender_email: "test@rabbit.com",
      sender_name: "Nick",
      form_name: "test form",
      download_link: "https://ds_onpremise.com/files/download/testcode",
      mail_lang: "en"
    }
  end

  it 'should return 200' do |example|
    example.metadata[:rpdoc_example_key] = '200'
    example.metadata[:rpdoc_example_name] = '成功寄送公開表單下載連接'
    post(@path, params: @params.to_json, headers: @headers)  
    expect(response).to have_http_status(200)
  end
end
