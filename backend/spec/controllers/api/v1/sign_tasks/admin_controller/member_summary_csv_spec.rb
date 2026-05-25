require 'rails_helper'

RSpec.describe Api::V1::SignTasks::AdminController, type: :request do
  include_context 'rpdoc'

  before(:each) do |example|
    example.metadata[:rpdoc_action_key] = 'member_summary_csv'
    example.metadata[:rpdoc_action_name] = '匯出群組成員任務報表CSV'
    example.metadata[:rpdoc_example_folders] = ['v1', 'sign_tasks', 'admin']

    mock_http_send
    @member = mock_member(:member_me)
    @headers = {
      'Authorization' => 'Bearer {{rabbit_token}}',
      'Content-Type' => 'application/json'
    }
    @group = mock_group(@member)
    3.times{|_| FactoryBot.create(:waiting_for_me1)}
    4.times{|_| FactoryBot.create(:waiting_for_others1)}
    2.times{|_| FactoryBot.create(:completed_task1)}
    1.times{|_| FactoryBot.create(:draft_task)}
  end

  describe '#tasks' do
    before(:each) do
      @path = '/api/v1/sign_tasks/admin/member_summary_csv'
      @params = {
        group_id: @group.id,
        emails: [@member.email],
        start_from: 1.days.ago.strftime('%Y%m%d'),
        end_at: Time.now.strftime('%Y%m%d')
      }
    end

    it 'should return 200', rpdoc_example_key: 200, rpdoc_example_name: 'export admin member report success' do
      post @path, params: @params.to_json, headers: @headers
      expect(response).to have_http_status(200)
      expect(response.header['Content-Type'].include?('application/zip')).to be(true)
      expect(response.header['Content-Disposition'].include?('attachment')).to be(true)
    end

    it 'should return 400207 if member not belongs to group', rpdoc_example_key: 400207, rpdoc_example_name: 'export admin member report failed (member not belongs to group)' do
      @member.group_invites.first.revoke!
      post @path, params: @params.to_json, headers: @headers
      expect(response).to have_http_status(400)
      expect(json['error_code']).to eq(400207)
    end

    it 'should return 403056 if group member forbid to view tasks', rpdoc_example_key: 403056, rpdoc_example_name: 'export admin member report failed (group member forbid to view tasks)' do
      a = FactoryBot.create(:member_a)
      invite = @group.add_member(a)
      invite.accept!
      mock_member(:member_a)
      post @path, params: @params.to_json, headers: @headers
      expect(response).to have_http_status(403)
      expect(json['error_code']).to eq(403056)
    end
  end

end
