require 'rails_helper'

RSpec.describe '/api/internal/group_mailer_controller#group_cancel', type: :request do
  include_context 'rpdoc'

  before(:each) do |example|
    example.metadata[:rpdoc_action_key] = 'group_cancel'
    example.metadata[:rpdoc_action_name] = '寄送群組拒絕信'
    example.metadata[:rpdoc_example_folders] = ['internal', 'mailer', 'group_mailer', 'group_cancel']

    @path = '/api/internal/mailer/group_cancel'
    @headers = { 'Content-Type' => 'application/json' }
    @params = {
      email: 'default@rabbit.com',
      sender_email: 'sender@rabbit.com',
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
