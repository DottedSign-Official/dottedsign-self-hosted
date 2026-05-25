require 'rails_helper'

RSpec.describe '/api/internal/member_mailer_controller#confirmation_instruction', type: :request do
  include_context 'rpdoc'

  before(:each) do |example|
    example.metadata[:rpdoc_action_key] = 'confirmation_instruction'
    example.metadata[:rpdoc_action_name] = '寄送會員驗證信'
    example.metadata[:rpdoc_example_folders] = ['internal', 'mailer', 'member_mailer', 'confirmation_instruction']

    @path = '/api/internal/mailer/confirmation_instruction'
    @headers = { 'Content-Type' => 'application/json' }
    @params = {
      email: 'default@rabbit.com',
      token: 'token',
      confirm_link: 'http://127.0.0.1/confirm_link',
      user_name: 'test_user',
      mail_lang: 'zh-TW'
    }
  end

  it 'should return 200' do |example|
    example.metadata[:rpdoc_example_key] = '200'
    example.metadata[:rpdoc_example_name] = '成功寄送信件'

    post(@path, params: @params.to_json, headers: @headers)
    expect(response).to have_http_status(200)
  end
end
