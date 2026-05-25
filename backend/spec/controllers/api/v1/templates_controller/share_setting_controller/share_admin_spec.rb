require 'rails_helper'

RSpec.describe Api::V1::Templates::ShareSettingsController, type: :request do
  include_context 'rpdoc'

  before(:each) do |example|
    example.metadata[:rpdoc_action_key] = 'share_template_to_group'
    example.metadata[:rpdoc_action_name] = 'share template to group'
    example.metadata[:rpdoc_example_folders] = ['v1', 'templates', 'share_settings']
    mock_template_group_share_enable
    @headers = {
      'Content-Type' => 'application/json',
      'Authorization' => 'Bearer {{rabbit_token}}'
    }
    @member = mock_member(:member_me, skip_auth: example.metadata[:skip_auth])
    @group = mock_group(@member)
    @path = '/api/v1/templates/share_settings/admin_share'
    @template = FactoryBot.create(:template, dummy_stage_count: 3)
    @params = {
      template_id: @template.id,
      group_ids: [@group.id]
    }
  end

  describe '#update' do
    it 'should return 200 ', rpdoc_example_key: 200_1, rpdoc_example_name: 'share template to other group' do
      put @path, params: @params.to_json, headers: @headers
      expect(response).to have_http_status(200)
    end

    it 'should return 400 ', rpdoc_example_key: 403_1, rpdoc_example_name: 'member not group admin' do
      @member.group_id = nil
      @member.save!
      put @path, params: @params.to_json, headers: @headers
      expect(response).to have_http_status(403)
    end
  end
end
