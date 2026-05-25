# frozen_string_literal: true

require 'rails_helper'

RSpec.describe '/api/internal/member_mailer_controller#forget_password', type: :request do
  include_context 'rpdoc'

  before(:each) do |example|
    example.metadata[:rpdoc_action_key] = 'forget_password'
    example.metadata[:rpdoc_action_name] = '寄送忘記密碼信'
    example.metadata[:rpdoc_example_folders] = ['internal', 'mailer','member_mailer', 'forget_password']

    @path = '/api/internal/mailer/forget_password'
    @headers = { 'Content-Type' => 'application/json' }
    @params = {
      email: 'default@rabbit.com',
      reset_password_link: 'http://localhost/reset-password"'
    }
  end

  it 'should return 200' do |example|
    example.metadata[:rpdoc_example_key] = '200'
    example.metadata[:rpdoc_example_name] = '寄送忘記密碼信'

    post(@path, params: @params.to_json, headers: @headers)
    expect(response).to have_http_status(200)
  end
end
