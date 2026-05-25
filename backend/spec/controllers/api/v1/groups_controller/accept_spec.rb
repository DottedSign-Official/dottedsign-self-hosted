require 'rails_helper'

RSpec.describe '/api/v1/groups_controller#accept', type: :request do
  include_context 'rpdoc'

  before(:each) do |example|
    example.metadata[:rpdoc_action_key] = 'accept'
    example.metadata[:rpdoc_action_name] = '用戶接受群組邀請'
    example.metadata[:rpdoc_example_folders] = ['v1', 'groups']

    @member = mock_member(:member_me)
    @headers = {'Content-Type' => 'application/json'}
    @group = mock_group(@member)
    @invitee = FactoryBot.create(:member_a)
    @invite = @group.add_member(@invitee)
    @path = "/api/v1/groups/accept"
  end

  context '#accept' do

    before(:each) do
      @params = {
        invite_token: @invite.invite_token
      }
    end

    it 'should return 200 if member accept and register success', rpdoc_example_key: 200, rpdoc_example_name: '200 (inviter accept and register success)' do
      @invitee.update(is_registered: false, confirmed_at: nil)
      @params[:password] = '11111111'
      @params[:name] = 'register'
      post @path, params: @params.to_json, headers: @headers
      expect(response).to have_http_status(200)
      @invite.reload
      @invitee.reload
      expect(@invite.status).to eq('accepted')
      expect(@invitee.is_registered).to be(true)
      expect(@invitee.confirmed?).to be(true)
      expect(@invitee.valid_password?(@params[:password])).to be(true)
    end

    it 'should return 400_1307 if invite token invalid', rpdoc_example_key: 400_1307, rpdoc_example_name: '400_1307 (invite token invalid)' do
      @params[:invite_token] = 'invalid token'
      post @path, params: @params.to_json, headers: @headers
      expect(response).to have_http_status(400)
      expect(json['error_code']).to eq(400_1307)
    end

    it 'should return 404_1301 if invite not found', rpdoc_example_key: 404_1301, rpdoc_example_name: '404_1301 (invite not found)' do
      payload = {
        invite_id: 0,
        expired_at: Time.zone.now.to_i + GroupInvite::INVITE_EXPIRED_IN
      }
      @params[:invite_token] = JWT.encode(payload, Secrets.jwt.secret, Secrets.jwt.encode_algorithm)
      post @path, params: @params.to_json, headers: @headers
      expect(response).to have_http_status(404)
      expect(json['error_code']).to eq(404_1301)
    end

    it 'should return 400_1304 if invite already accept', rpdoc_example_key: 400_1304, rpdoc_example_name: '400_1304 (invite already accept)' do
      @invite.accept!
      post @path, params: @params.to_json, headers: @headers
      expect(response).to have_http_status(400)
      expect(json['error_code']).to eq(400_1304)
    end

    it 'should return 400_1305 if invite not acceptable', rpdoc_example_key: 400_1305, rpdoc_example_name: '400_1305 (invite not acceptable)' do
      @invite.revoke!
      post @path, params: @params.to_json, headers: @headers
      expect(response).to have_http_status(400)
      expect(json['error_code']).to eq(400_1305)
    end

    it 'should return 400_1306 if invite need register info', rpdoc_example_key: 400_1306, rpdoc_example_name: '400_1306 (invite need register info)' do
      @invitee.update(is_registered: false)
      post @path, params: @params.to_json, headers: @headers
      expect(response).to have_http_status(400)
      expect(json['error_code']).to eq(400_1306)
      expect(json['member_email'].present?).to be(true)
    end

  end

end
