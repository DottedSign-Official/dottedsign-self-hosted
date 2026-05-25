# frozen_string_literal: true

require 'rails_helper'

RSpec.describe '/api/internal/sign_mail_controller#forward_request', type: :request do
  include_context 'rpdoc'

  before(:each) do |example|
    example.metadata[:rpdoc_action_key] = 'forward_request'
    example.metadata[:rpdoc_action_name] = '寄送更換簽署者請求信'
    example.metadata[:rpdoc_example_folders] =  ['internal', 'mailer', 'sign_mailer', 'sign_mailer']

    @path = '/api/internal/mailer/forward_request'
    @headers = { 'Content-Type' => 'application/json' }
    @params = {
      email: "default@rabbit.com",
      user_name: "Joey",
      sender_email: "test@rabbit.com",
      sender_name: "Lily",
      doc_name: "Purchase Order",
      file_link: "https://ds_onpremise.com/task?code=123",
      new_signer: {
        email: "william@tesla.com",
        name: "william yoshino"
      },
      message: "I want to change the signer to william yoshino, thank you.",
      mail_lang: "en"
    }
  end

  it 'should return 200' do |example|
    example.metadata[:rpdoc_example_key] = '200'
    example.metadata[:rpdoc_example_name] = '成功寄送更換簽署者請求信'

    post(@path, params: @params.to_json, headers: @headers)
    expect(response).to have_http_status(200)
  end
end
