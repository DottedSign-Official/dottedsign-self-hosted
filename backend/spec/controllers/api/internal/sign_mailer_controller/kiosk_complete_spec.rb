# frozen_string_literal: true

require 'rails_helper'

RSpec.describe '/api/internal/sign_mail_controller#kiosk_complete', type: :request do
  include_context 'rpdoc'

  before(:each) do |example|
    example.metadata[:rpdoc_action_key] = 'kiosk_complete'
    example.metadata[:rpdoc_action_name] = '寄送臨櫃完成信'
    example.metadata[:rpdoc_example_folders] = ['internal', 'mailer', 'sign_mailer', 'kiosk_complete']

    @path = '/api/internal/mailer/kiosk_complete'
    @headers = { 'Content-Type' => 'application/json' }
    @params = {
      sender_email: "default@rabbit.com",
      sender_name: "default",
      email: "bryant.wu@kdanmobile.com",
      doc_name: "Purchase Order.pdf",
      total_size: 123456789,
      doc_download_link: "https://ds_onpremise.com?...pdf",
      attachment_link: "https://ds_onpremise.com?...pdf",
      message: "completed",
      mail_lang: "en"
    }
  end

  it 'should return 200' do |example|
    example.metadata[:rpdoc_example_key] = '200'
    example.metadata[:rpdoc_example_name] = '成功寄送臨櫃完成信給簽署者'
    post(@path, params: @params.to_json, headers: @headers)
    expect(response).to have_http_status(200)
  end

end
