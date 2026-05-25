# frozen_string_literal: true

require 'rails_helper'

RSpec.describe '/api/internal/sign_mail_controller#doc_backup', type: :request do
  include_context 'rpdoc'

  before(:each) do |example|
    example.metadata[:rpdoc_action_key] = 'doc_backup'
    example.metadata[:rpdoc_action_name] = '寄送文件備份信'
    example.metadata[:rpdoc_example_folders] = ['internal', 'mailer', 'sign_mailer', 'sign_mailer']

    @path = '/api/internal/mailer/doc_backup'
    @headers = { 'Content-Type' => 'application/json' }
    @params = {
      email: "default@rabbit.com",
      user_name: "Joey",
      doc_name: "Purchase Order.pdf",
      total_size: 1239546789,
      file_link: "https://ds_onpremise.com/task?code=123",
      doc_download_link: "https://ds_onpremise.com?...pdf",
      attachment_link: "https://ds_onpremise.com?...pdf",
      mail_lang: "en"
    }
  end

  it 'should return 200' do |example|
    example.metadata[:rpdoc_example_key] = '200'
    example.metadata[:rpdoc_example_name] = '成功寄送文件備份信'

    post(@path, params: @params.to_json, headers: @headers)
    expect(response).to have_http_status(200)
  end
end
