# frozen_string_literal: true

require 'rails_helper'

RSpec.describe '/api/internal/sign_mail_controller#task_update', type: :request do
  include_context 'rpdoc'

  before(:each) do |example|
    example.metadata[:rpdoc_action_key] = 'task_update'
    example.metadata[:rpdoc_action_name] = '寄送任務更新通知給任務擁有者'
    example.metadata[:rpdoc_example_folders] = ['internal', 'mailer', 'sign_mailer', 'sign_mailer']

    @path = '/api/internal/mailer/task_update'
    @headers = { 'Content-Type' => 'application/json' }
    @params = {
      email: "default@rabbit.com",
      user_name: "Joey",
      doc_name: "Purchase Order",
      file_link: "https://ds_onpremise.com/task?code=123",
      old_receiver_email: "lily@helloworld.com",
      old_receiver_name: "Lily",
      new_receiver_email: "laura@tesla.com",
      new_receiver_name: "Wonder Laura",
      execute_by: "self",
      forward_reason: "Wonder Laura is the best signer",
      mail_lang: "en"
    }
  end

  it 'should return 200' do |example|
    example.metadata[:rpdoc_example_key] = '200'
    example.metadata[:rpdoc_example_name] = '成功寄送任務更新通知給任務擁有者'

    post(@path, params: @params.to_json, headers: @headers)
    expect(response).to have_http_status(200)
  end
end
