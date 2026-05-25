# frozen_string_literal: true

require 'rails_helper'

RSpec.describe '/api/internal/sign_mail_controller#sign_decline', type: :request do
  include_context 'rpdoc'

  before(:each) do |example|
    example.metadata[:rpdoc_action_key] = 'sign_decline'
    example.metadata[:rpdoc_action_name] = '寄送拒簽信件'
    example.metadata[:rpdoc_example_folders] = ['internal', 'mailer', 'sign_mailer', 'sign_decline']

    @path = '/api/internal/mailer/sign_decline'
    @headers = { 'Content-Type' => 'application/json' }
    @params = {
      email: "test@example.com",
      email_info: { test_email: "name" },
      sender_email: 'test@test.com',
      sender_name: 'Test',
      doc_name: 'Test File',
      file_link: "#{Settings.branch_deep_link.web}/task?code=token",
      decline_reason: "decline reason",
      mail_lang: 'zh-TW'
    }
  end

  it 'should return 200' do |example|
    example.metadata[:rpdoc_example_key] = '200'
    example.metadata[:rpdoc_example_name] = '成功寄送拒簽信件'
    post(@path, params: @params.to_json, headers: @headers)
    expect(response).to have_http_status(200)
  end
end
