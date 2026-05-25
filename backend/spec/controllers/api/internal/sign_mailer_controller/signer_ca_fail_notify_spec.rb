require 'rails_helper'

RSpec.describe '/api/internal/signer_mailer_controller#signer_ca_fail_notify', type: :request do
  include_context 'rpdoc'

  before(:each) do |example|
    example.metadata[:rpdoc_action_key] = 'signer ca fail notify'
    example.metadata[:rpdoc_action_name] = '寄送簽署者 CA 壓印失敗信'
    example.metadata[:rpdoc_example_folders] = ['internal', 'mailer', 'signer_mailer', 'signer_ca_fail_notify']

    @path = '/api/internal/mailer/signer_ca_fail_notify'
    @headers = { 'Content-Type' => 'application/json' }
    lang = 'en'
    @params = {
      email: "test@rabbit.com",
      name: "test",
      doc_name: "test",
      file_link: "#{Settings.branch_deep_link.web}/#{lang}/rollback?code=testtest",
    }
  end

  it 'should return 200' do |example|
    example.metadata[:rpdoc_example_key] = '200'
    example.metadata[:rpdoc_example_name] = '成功寄送信件'
    post(@path, params: @params.to_json, headers: @headers)
    expect(response).to have_http_status(200)
  end

  it 'should return 200' do |example|
    example.metadata[:rpdoc_example_key] = '200'
    example.metadata[:rpdoc_example_name] = '成功寄送信件'
    @params[:deadline] = Time.now.to_i
    post(@path, params: @params.to_json, headers: @headers)
    expect(response).to have_http_status(200)
  end
end
