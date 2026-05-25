require 'rails_helper'

RSpec.describe '/api/v1/groups_controller#upload_icon', type: :request do
  include_context 'rpdoc'

  before(:each) do |example|
    example.metadata[:rpdoc_action_key] = 'upload_icon'
    example.metadata[:rpdoc_action_name] = '上傳群組頭像'
    example.metadata[:rpdoc_example_folders] = ['v1', 'groups']

    @member = mock_member(:member_me)
    @headers = {'Authorization' => 'Bearer {{rabbit_token}}', 'Content-Type' => 'multipart/form-data'}
    @group = mock_group(@member)
    @path = "/api/v1/groups/upload_icon"
  end

  context '#upload_icon' do

    before(:each) do
      allow_any_instance_of(ActiveStorage::Attached::One).to receive(:attach).and_return(true)
      allow_any_instance_of(ActiveStorage::Attached::One).to receive(:attached?).and_return(true)
      @params = {
        group_id: @group.id,
        group_icon: fixture_file_upload('kdan.png', 'image/png')
      }
    end

    it 'should return 200', rpdoc_example_key: 200, rpdoc_example_name: 'add member to group success' do
      post @path, params: @params, headers: @headers
      expect(response).to have_http_status(200)
      expect(@group.icon.present?).to be(true)
      expect(@group.icon.uploaded_at.present?).to be(true)
    end

    it 'should add a group icon service file', rpdoc_skip: true do
      expect{post @path, params: @params, headers: @headers}.to change{ServiceFile.where(storable: @group, label: 'icon').count}.by(1)
    end

    it 'should remove group icon service file', rpdoc_skip: true do
      post @path, params: @params, headers: @headers
      
      @params[:group_icon] = nil
      expect{
        post @path, params: @params, headers: @headers
      }.to change{
        ServiceFile.where(storable: @group, label: 'icon').count
      }.by(-1)
    end

    it 'should return 400_207 if member not related to group', rpdoc_example_key: 400_207, rpdoc_example_name: 'add member to group failed (member not related to group)' do
      mock_member(:member_a)
      post @path, params: @params, headers: @headers
      expect(response).to have_http_status(400)
      expect(json['error_code']).to eq(400_207)
    end

    it 'should return 403_056 if member forbid to manage company logo', rpdoc_example_key: 403_056, rpdoc_example_name: 'add member to group failed (member forbid to manage company logo)' do
      a = mock_member(:member_a)
      invite = @group.add_member(a)
      invite.accept!
      a.reload
      post @path, params: @params, headers: @headers
      expect(response).to have_http_status(403)
      expect(json['error_code']).to eq(403_056)
    end
  end

end
