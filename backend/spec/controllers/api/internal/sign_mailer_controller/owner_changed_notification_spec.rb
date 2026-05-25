# frozen_string_literal: true

require 'rails_helper'

RSpec.describe '/api/internal/sign_mail_controller#owner_changed_notification', type: :request do
  include_context 'rpdoc'

  before(:each) do |example|
    example.metadata[:rpdoc_action_key] = 'owner_changed_notification'
    example.metadata[:rpdoc_action_name] = '寄送任務發起者變更通知'
    example.metadata[:rpdoc_example_folders] = ['internal', 'mailer', 'sign_mailer', 'sign_mailer']

    @path = '/api/internal/mailer/owner_changed_notification'
    @headers = { 'Content-Type' => 'application/json' }
    @params = {
      email: 'default@rabbit.com',
      user_name: 'Joey',
      doc_name: 'Purchase Order',
      old_owner_name: 'Old Owner',
      new_owner_name: 'New Owner',
      new_owner_email: 'new_owner@rabbit.com',
      mail_lang: 'en'
    }
  end

  it 'should return 200' do |example|
    example.metadata[:rpdoc_example_key] = '200'
    example.metadata[:rpdoc_example_name] = '成功寄送任務發起者變更通知'

    post(@path, params: @params.to_json, headers: @headers)
    expect(response).to have_http_status(200)
  end
end
