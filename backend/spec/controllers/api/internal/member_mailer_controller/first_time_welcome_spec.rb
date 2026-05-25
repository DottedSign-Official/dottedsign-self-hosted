# frozen_string_literal: true

require 'rails_helper'

RSpec.describe '/api/internal/member_mailer_controller#first_time_welcome', type: :request do
  include_context 'rpdoc'

  before(:each) do |example|
    example.metadata[:rpdoc_action_key] = 'first_time_welcome'
    example.metadata[:rpdoc_action_name] = '寄送歡迎信'
    example.metadata[:rpdoc_example_folders] = ['internal', 'mailer','member_mailer', 'first_time_welcome']

    @path = '/api/internal/mailer/first_time_welcome'
    @headers = { 'Content-Type' => 'application/json' }
    @params = {
      email: 'default@rabbit.com',
      user_name: 'Test Name',
      mail_lang: 'zh-TW'
    }
  end

  it 'should return 200' do |example|
    example.metadata[:rpdoc_example_key] = '200'
    example.metadata[:rpdoc_example_name] = '成功寄送歡迎信'

    post(@path, params: @params.to_json, headers: @headers)
    expect(response).to have_http_status(200)
  end
end
