require 'rails_helper'

RSpec.describe Api::V1::SignTasks::AdminController, type: :request do
  include_context 'rpdoc'

  before(:each) do |example|
    example.metadata[:rpdoc_action_key] = 'tasks'
    example.metadata[:rpdoc_action_name] = '取得群組任務列表'
    example.metadata[:rpdoc_example_folders] = ['v1', 'sign_tasks', 'admin']

    mock_http_send
    @member = mock_member(:member_me)
    @headers = {
      'Authorization' => 'Bearer {{rabbit_token}}'
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
      @path = '/api/v1/sign_tasks/admin/tasks'
      @params = {
        group_id: @group.id,
        category: 'waiting_for_group',
        emails: [@member.email],
        start_from: 1.day.ago.strftime('%Y%m%d'),
        end_at: Time.now.strftime('%Y%m%d'),
        page: 1,
        per_page: 20
      }
    end

    it 'should return 200', rpdoc_example_key: 200, rpdoc_example_name: 'get admin tasks success' do
      get "#{@path}?#{URI.encode_www_form(@params)}", headers: @headers
      expect(response).to have_http_status(200)
      expect(json['data']['tasks'].length).to eq(6)
      expect(json['data']['summary']['waiting_for_group']).to eq(6)
      expect(json['data']['summary']['waiting_for_other_groups']).to eq(8)
      expect(json['data']['summary']['group_completed']).to eq(4)
      expect(json['data']['summary']['group_draft']).to eq(2)
    end

    it 'should return 400207 if member not belongs to group', rpdoc_example_key: 400207, rpdoc_example_name: 'get admin tasks failed (member not belongs to group)' do
      @member.group_invites.first.revoke!
      get "#{@path}?#{URI.encode_www_form(@params)}", headers: @headers
      expect(response).to have_http_status(400)
      expect(json['error_code']).to eq(400207)
    end

    it 'should return 403056 if group member forbid to view tasks', rpdoc_example_key: 403056, rpdoc_example_name: 'get admin permission failed (group member forbid to view tasks)' do
      a = FactoryBot.create(:member_a)
      invite = @group.add_member(a)
      invite.accept!
      mock_member(:member_a)
      get "#{@path}?#{URI.encode_www_form(@params)}", headers: @headers
      expect(response).to have_http_status(403)
      expect(json['error_code']).to eq(403056)
    end
  end

end
