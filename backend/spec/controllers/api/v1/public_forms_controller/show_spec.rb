# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Api::V1::PublicFormsController, type: :request do
  include_context 'rpdoc'

  before(:each) do |example|
    example.metadata[:rpdoc_action_key] = 'show'
    example.metadata[:rpdoc_action_name] = '取得公開表單詳細資訊'
    example.metadata[:rpdoc_example_folders] = ['v1', 'public_forms']

    @member = mock_member(:member_me, skip_auth: example.metadata[:skip_auth])
    @form = FactoryBot.create(:public_form, owner: @member)

    mock_headers
    @path = "/api/v1/public_forms/#{@form.id}"
  end

  describe '#show' do
    it 'should return 200', rpdoc_example_key: 200, rpdoc_example_name: 'show public form success (without detail)' do
      get @path, headers: @headers
      expect(response).to have_http_status(200)
    end

    it 'should return 200', rpdoc_example_key: 200_2, rpdoc_example_name: 'show public form success (with detail)' do
      params = { with_detail: true }
      get @path, params: params, headers: @headers
      expect(response).to have_http_status(200)
      expect(json['data']['form_info']).to have_key('download_link')
    end

    it 'should return 404_043 if form not found', rpdoc_example_key: 404_043, rpdoc_example_name: 'show public form failed (form not exist)' do
      @path = '/api/v1/public_forms/-1'
      get @path, headers: @headers
      expect(response).to have_http_status(404)
      expect(json['error_code']).to eq(404_043)
      expect(json['error_key']).to eq('form_not_found')
    end

    it 'should return 400_915 if form is delete', rpdoc_example_key: 400_915, rpdoc_example_name: 'show public form failed (form deleted)' do
      @form.set_delete
      get @path, headers: @headers
      expect(response).to have_http_status(400)
      expect(json['error_code']).to eq(400_915)
      expect(json['error_key']).to eq('form_is_deleted')
    end
  end
end
