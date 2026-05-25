require 'rails_helper'

RSpec.describe '/api/internal/system_mailer_controller#system_ca_fail_notify', type: :request do
  include_context 'rpdoc'

  before(:each) do |example|
    example.metadata[:rpdoc_action_key] = 'ca fail notify'
    example.metadata[:rpdoc_action_name] = '寄送 CA 壓印失敗信'
    example.metadata[:rpdoc_example_folders] = ['internal', 'mailer', 'system_mailer', 'system_ca_fail_notify']

    @path = '/api/internal/mailer/system_ca_fail_notify'
    @headers = { 'Content-Type' => 'application/json' }
    @params = {
      emails: ["test@rabbit.com"],
      sign_task_id: 1,
      sign_stage_id: 1,
      error_message: "error_message"
    }
  end

  it 'should return 200' do |example|
    example.metadata[:rpdoc_example_key] = '200'
    example.metadata[:rpdoc_example_name] = '成功寄送信件'

    post(@path, params: @params.to_json, headers: @headers)
    expect(response).to have_http_status(200)
  end
end
