require 'rails_helper'

RSpec.describe Api::V1::Templates::ShareSettingsController, type: :request do
  include_context 'rpdoc'

  before(:each) do |example|
    example.metadata[:rpdoc_action_key] = 'share_template_list'
    example.metadata[:rpdoc_action_name] = 'share template list'
    example.metadata[:rpdoc_example_folders] = ['v1', 'templates', 'share_settings']
    mock_template_group_share_enable
    @headers = {
      'Content-Type' => 'application/json',
      'Authorization' => 'Bearer {{rabbit_token}}'
    }
    @member_a = mock_member(:member_a, skip_auth: example.metadata[:skip_auth])
    @new_group = mock_group(@member_a, role: 'admin', group_name: "new_group")

    @member = mock_member(:member_me, skip_auth: example.metadata[:skip_auth])
    @group = mock_group(@member, role: 'admin')

    @path = '/api/v1/templates/share_settings/share_list'
    @template = FactoryBot.create(:template, dummy_stage_count: 3)
    mock_share_setting(@template, @group)
    mock_share_setting(@template, @new_group)
    @params = {
      page: 1,
      per_page: 10,
      filter_type: 'self'
    }
  end

  describe '#show list' do
    it 'should return 200 ', rpdoc_example_key: 200_1, rpdoc_example_name: 'share template to other group' do
      get @path, params: @params, headers: @headers
      expect(response).to have_http_status(200)
    end
  end
end
