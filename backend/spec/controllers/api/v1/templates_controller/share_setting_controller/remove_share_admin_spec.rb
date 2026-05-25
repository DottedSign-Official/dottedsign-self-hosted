require 'rails_helper'

RSpec.describe Api::V1::Templates::ShareSettingsController, type: :request do
  include_context 'rpdoc'

  before(:each) do |example|
    example.metadata[:rpdoc_action_key] = 'remove_share_template_to_group'
    example.metadata[:rpdoc_action_name] = 'remove share template to group'
    example.metadata[:rpdoc_example_folders] = ['v1', 'templates', 'share_settings']
    mock_template_group_share_enable
    @headers = {
      'Content-Type' => 'application/json',
      'Authorization' => 'Bearer {{rabbit_token}}'
    }
    @member_a = mock_member(:member_a)
    @new_group = mock_group(@member_a, role: 'admin', group_name: "new_group")
    @member = mock_member(:member_me, skip_auth: example.metadata[:skip_auth])
    @group = mock_group(@member)
    @path = '/api/v1/templates/share_settings/admin_remove_share'
    @template = FactoryBot.create(:template, dummy_stage_count: 3)
    @template_a = FactoryBot.create(:template, owner: @member_a, dummy_stage_count: 2)
    ShareSetting.create!(shared: @template, target: @group)

    @params = {
      template_id: @template.id,
      group_id: @group.id
    }
  end

  describe '#remove' do
    it 'should return 200 ', rpdoc_example_key: 200_1, rpdoc_example_name: 'remove share template to other group' do
      delete @path, params: @params.to_json, headers: @headers
      expect(response).to have_http_status(200)
    end

    it 'should return 403 member not group admin', rpdoc_example_key: 403_1, rpdoc_example_name: 'member not group admin' do
      @member.group_id = nil
      @member.save!
      delete @path, params: @params.to_json, headers: @headers
      expect(response).to have_http_status(403)
    end

    it 'should return 403 template not accessible to member ', rpdoc_example_key: 403_2, rpdoc_example_name: 'template not accessible to member' do
      @params[:group_id] = @new_group.id
      @params[:template_id] = @template_a.id
      delete @path, params: @params.to_json, headers: @headers
      expect(response).to have_http_status(403)
    end

    it 'should return 403 no permission ', rpdoc_example_key: 403_3, rpdoc_example_name: 'no permission' do
      ShareSetting.create!(shared: @template_a, target: @group)
      @params[:group_id] = @new_group.id
      @params[:template_id] = @template_a.id
      delete @path, params: @params.to_json, headers: @headers
      expect(response).to have_http_status(403)
    end

    it 'should return 400 ', rpdoc_example_key: 400_1, rpdoc_example_name: 'member not group admin' do
      ShareSetting.create!(shared: @template, target: @new_group)
      delete @path, params: @params.to_json, headers: @headers
      expect(response).to have_http_status(400)
    end
  end
end
