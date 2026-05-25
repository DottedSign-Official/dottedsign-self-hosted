# frozen_string_literal: true

require 'rails_helper'

RSpec.describe '/api/internal/sign_mail_controller#verify_method_changed', type: :request do
  include_context 'rpdoc'

  before(:each) do |example|
    example.metadata[:rpdoc_action_key] = 'verify_method_changed'
    example.metadata[:rpdoc_action_name] = '寄送驗證方式變更通知'
    example.metadata[:rpdoc_example_folders] = ['internal', 'mailer', 'sign_mailer', 'sign_mailer']

    @path = '/api/internal/mailer/verify_method_changed'
    @headers = { 'Content-Type' => 'application/json' }
    @params = {
      email: "default@rabbit.com",
      user_name: "Joey",
      change_time: "2021-01-21 18:19:40 UTC",
      otp_via_email: true,
      mail_lang: "en"
    }
  end

  it 'should return 200' do |example|
    example.metadata[:rpdoc_example_key] = '200'
    example.metadata[:rpdoc_example_name] = '成功寄送驗證方式變更通知'

    post(@path, params: @params.to_json, headers: @headers)
    expect(response).to have_http_status(200)
  end
end
