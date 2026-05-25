require 'rails_helper'

RSpec.describe Api::V1::SignTasks::AdminController, type: :request do
  include_context 'rpdoc'

  before(:each) do |example|
    example.metadata[:rpdoc_action_key] = 'report'
    example.metadata[:rpdoc_action_name] = '取得群組任務報表'
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
      @path = '/api/v1/sign_tasks/admin/report'
      @params = {
        group_id: @group.id,
        emails: [@member.email],
        start_from: 1.days.ago.strftime('%Y%m%d'),
        end_at: Time.now.strftime('%Y%m%d'),
        zone: 8
      }
    end

    it 'should return 200', rpdoc_example_key: 200, rpdoc_example_name: 'get admin report success' do
      get "#{@path}?#{URI.encode_www_form(@params)}", headers: @headers
      expect(response).to have_http_status(200)
      expect(json['data']['sent_trend'].length).to eq(2)
      expect(json['data']['completed_trend'].length).to eq(2)
      expect(json['data']['sent']).to eq(3+4+2)
      expect(json['data']['waiting']).to eq(3+4)
      expect(json['data']['completed']).to eq(2)
      expect(json['data']['complete_rate']).to eq("#{(2.0/(3+4+2)*100).round(1)}%")
      expect(json['data']['cancel_rate']).to eq('N/A')
    end

    it 'should return 400207 if member not belongs to group', rpdoc_example_key: 400207, rpdoc_example_name: 'get admin report failed (member not belongs to group)' do
      @member.group_invites.first.revoke!
      get "#{@path}?#{URI.encode_www_form(@params)}", headers: @headers
      expect(response).to have_http_status(400)
      expect(json['error_code']).to eq(400207)
    end

    it 'should return 403056 if group member forbid to view tasks', rpdoc_example_key: 403056, rpdoc_example_name: 'get admin report failed (group member forbid to view tasks)' do
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
