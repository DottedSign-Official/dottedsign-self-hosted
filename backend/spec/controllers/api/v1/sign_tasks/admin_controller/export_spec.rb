require 'rails_helper'

RSpec.describe Api::V1::SignTasks::AdminController, type: :request do
  include_context 'rpdoc'

  before(:each) do |example|
    example.metadata[:rpdoc_action_key] = 'export'
    example.metadata[:rpdoc_action_name] = '匯出群組任務CSV'
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

    3.times{|_| FactoryBot.create(:waiting_for_me_envelope)}
    4.times{|_| FactoryBot.create(:waiting_for_others_envelope)}
    2.times{|_| FactoryBot.create(:completed_envelope)}
    1.times{|_| FactoryBot.create(:draft_envelope)}
  end

  describe '#tasks' do
    before(:each) do
      @path = '/api/v1/sign_tasks/admin/export'
      @params = {
        group_id: @group.id,
        category: 'waiting_for_group',
        start_from: 1.day.ago.strftime('%Y%m%d'),
        end_at: Time.now.strftime('%Y%m%d')
      }
    end

    it 'should return 200', rpdoc_example_key: 200_1, rpdoc_example_name: 'export admin tasks success (only waiting_for_group category)' do
      post @path, params: @params.to_json, headers: @headers
      expect(response).to have_http_status(200)
      expect(response.header['Content-Type'].include?('text/csv')).to be(true)
      expect(response.header['Content-Disposition'].include?('attachment')).to be(true)
      expect(response.body.split("\n").length).to eq(1+3+3*2)
    end

    it 'should return 200', rpdoc_example_key: 200_2, rpdoc_example_name: 'export admin tasks success (all team tasks)' do
      @params.delete(:category)
      post @path, params: @params.to_json, headers: @headers
      expect(response).to have_http_status(200)
      expect(response.header['Content-Type'].include?('text/csv')).to be(true)
      expect(response.header['Content-Disposition'].include?('attachment')).to be(true)
      expect(response.body.split("\n").length).to eq(1+3+4+2+1+(3+4+2+1)*2)
    end

    it 'should return 400207 if member not belongs to group', rpdoc_example_key: 400207, rpdoc_example_name: 'export admin tasks failed (member not belongs to group)' do
      @member.group_invites.first.revoke!
      post @path, params: @params.to_json, headers: @headers
      expect(response).to have_http_status(400)
      expect(json['error_code']).to eq(400207)
    end

    it 'should return 403056 if group member forbid to view tasks', rpdoc_example_key: 403056, rpdoc_example_name: 'get admin permission failed (group member forbid to view tasks)' do
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
