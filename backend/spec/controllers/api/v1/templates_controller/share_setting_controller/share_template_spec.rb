require 'rails_helper'

RSpec.describe Api::V1::Templates::ShareSettingsController, type: :request do
  include_context 'rpdoc'

  before(:each) do |example|
    example.metadata[:rpdoc_action_key] = 'share_template'
    example.metadata[:rpdoc_action_name] = 'share template'
    example.metadata[:rpdoc_example_folders] = ['v1', 'templates','share_settings']

    @member = mock_member(:member_me, skip_auth: example.metadata[:skip_auth])
    @group = mock_group(@member, role: 'admin')

    @headers = {
      'Content-Type' => 'application/json',
      'Authorization' => 'Bearer {{rabbit_token}}'
    }
    @path = '/api/v1/templates/share_settings/share_template'
    @template = FactoryBot.create(:template, dummy_stage_count: 3)
    @params = {
      template_id: @template.id,
    }
  end

  describe '#share_template' do
    it 'should return 200 ', rpdoc_example_key: 200_1, rpdoc_example_name: 'share template to self group' do
      put @path, params: @params.to_json, headers: @headers
      expect(response).to have_http_status(200)
    end

    it 'should return 400 ', rpdoc_example_key: 404_1, rpdoc_example_name: 'template_not_found' do
      @params[:template_id] = 999
      put @path, params: @params.to_json, headers: @headers
      expect(response).to have_http_status(404)
    end
  end
end
