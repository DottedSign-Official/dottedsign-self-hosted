# frozen_string_literal: true

require 'rails_helper'

RSpec.describe '/api/internal/sign_mail_controller#expire_remind', type: :request do
  include_context 'rpdoc'

  before(:each) do |example|
    example.metadata[:rpdoc_action_key] = 'expire_remind'
    example.metadata[:rpdoc_action_name] = '寄送簽名過期提醒信'
    example.metadata[:rpdoc_example_folders] =  ['internal', 'mailer', 'sign_mailer', 'sign_mailer']

    @path = '/api/internal/mailer/expire_remind'
    @headers = { 'Content-Type' => 'application/json' }
    @params = {
      email: "default@rabbit.com",
      user_name: "Lily",
      sender_name: "Joey",
      sender_email: "abc@test.com",
      doc_name: "Purchase Order",
      file_link: "https://ds_onpremise.com/task?code=123",
      deadline: 3,
      mail_lang: "en"
    }
  end

  it 'should return 200' do |example|
    example.metadata[:rpdoc_example_key] = '200'
    example.metadata[:rpdoc_example_name] = '成功寄送簽名過期提醒信'

    post(@path, params: @params.to_json, headers: @headers)
    expect(response).to have_http_status(200)
  end
end
