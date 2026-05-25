# frozen_string_literal: true

require 'rails_helper'

RSpec.describe '/api/internal/sign_mail_controller#sign_complete', type: :request do
  include_context 'rpdoc'

  before(:each) do |example|
    example.metadata[:rpdoc_action_key] = 'sign_complete'
    example.metadata[:rpdoc_action_name] = '寄送簽名完成信'
    example.metadata[:rpdoc_example_folders] = ['internal', 'mailer', 'sign_mailer', 'sign_complete']

    @path = '/api/internal/mailer/sign_complete'
    @headers = { 'Content-Type' => 'application/json' }
    @params = {
      email: "default@rabbit.com",
      user_name: "Lily",
      sender_email: "abc@test.com",
      sender_name: "Tom",
      doc_name: "Purchase Order.pdf",
      total_size: 123456789,
      doc_download_link: "https://ds_onpremise.com?...pdf",
      file_link: "https://ds_onpremise.com/task?code=123",
      template_name: "create_and_invite_complete",
      can_download_task: true,
      can_download_audit_trail: true,
      mail_lang: "en"
    }
  end

  it 'should return 200' do |example|
    example.metadata[:rpdoc_example_key] = '200'
    example.metadata[:rpdoc_example_name] = '成功寄送簽名完成信-1'
    post(@path, params: @params.to_json, headers: @headers)
    expect(response).to have_http_status(200)
  end

  it 'should return 200' do |example|
    example.metadata[:rpdoc_example_key] = '200_1'
    example.metadata[:rpdoc_example_name] = '成功寄送簽名完成信-2'
    @params[:template_name] = 'sign_and_send_complete'
    post(@path, params: @params.to_json, headers: @headers)
    expect(response).to have_http_status(200)
  end
end
