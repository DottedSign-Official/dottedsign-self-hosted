# frozen_string_literal: true

require 'rails_helper'

RSpec.describe '/api/internal/sign_mail_controller#deadline_change', type: :request do
  include_context 'rpdoc'

  before(:each) do |example|
    example.metadata[:rpdoc_action_key] = 'deadline_change'
    example.metadata[:rpdoc_action_name] = '寄送任務 Deadline 更新通知給簽署者'
    example.metadata[:rpdoc_example_folders] = ['internal', 'mailer', 'sign_mailer', 'sign_mailer']

    @path = '/api/internal/mailer/deadline_change'
    @headers = { 'Content-Type' => 'application/json' }
    @params = {
      email: "default@rabbit.com",
      user_name: "Lily",
      sender_email: "test@rabbit.com",
      sender_name: "Joey",
      doc_name: "Purchase Order",
      file_link: "https://ds_onpremise.com/task?code=123",
      deadline: "2021-02-21 18:19:40 UTC",
      mail_lang: "en"
    }
  end

  it 'should return 200' do |example|
    example.metadata[:rpdoc_example_key] = '200'
    example.metadata[:rpdoc_example_name] = '成功寄送任務 Deadline 更新通知給簽署者'
    post(@path, params: @params.to_json, headers: @headers)
    expect(response).to have_http_status(200)
  end
end
