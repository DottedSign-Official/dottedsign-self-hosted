# frozen_string_literal: true

require 'rails_helper'

RSpec.describe '/api/internal/sign_mail_controller#task_disable', type: :request do
  include_context 'rpdoc'

  before(:each) do |example|
    example.metadata[:rpdoc_action_key] = 'task_disable'
    example.metadata[:rpdoc_action_name] = '寄送任務更新通知給原簽署者'
    example.metadata[:rpdoc_example_folders] = ['internal', 'mailer', 'sign_mailer', 'sign_mailer']

    @path = '/api/internal/mailer/task_disable'
    @headers = { 'Content-Type' => 'application/json' }
    @params = {
      email: "default@rabbit.com",
      user_name: "Lily",
      sender_name: "Joey",
      sender_email: "abc@test.com",
      doc_name: "Purchase Order",
      new_receiver_name: "Wonder Laura",
      new_receiver_email: "laura@tesla.com",
      execute_by: "other",
      mail_lang: "en"
    }
  end

  it 'should return 200' do |example|
    example.metadata[:rpdoc_example_key] = '200'
    example.metadata[:rpdoc_example_name] = '成功寄送任務更新通知給原簽署者'

    post(@path, params: @params.to_json, headers: @headers)
    expect(response).to have_http_status(200)
  end
end
