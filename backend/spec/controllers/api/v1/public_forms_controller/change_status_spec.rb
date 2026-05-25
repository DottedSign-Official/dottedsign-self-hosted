# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Api::V1::PublicFormsController, type: :request do
  include_context 'rpdoc'

  before(:each) do |example|
    example.metadata[:rpdoc_action_key] = 'change_status'
    example.metadata[:rpdoc_action_name] = '變更公開表單狀態'
    example.metadata[:rpdoc_example_folders] = ['v1', 'public_forms']

    @member = mock_member(:member_me, skip_auth: example.metadata[:skip_auth])
    @form = FactoryBot.create(:public_form, owner: @member)

    mock_headers
    @path = "/api/v1/public_forms/change_status"
    @params = {
      form_id: @form.id,
      status: 'unpublish'
    }
  end

  describe '#change_status' do
    it 'should return 200 and set form unpublish', rpdoc_example_key: 200, rpdoc_example_name: 'change public form status success' do
      put @path, params: @params.to_json, headers: @headers
      expect(response).to have_http_status(200)
      @form.reload
      expect(@form.status).to eq(@params[:status])
    end

    it 'should return 200 and set form publish', rpdoc_skip: true do
      @form.unpublish!
      @params[:status] = 'publish'
      put @path, params: @params.to_json, headers: @headers
      expect(response).to have_http_status(200)
      @form.reload
      expect(@form.status).to eq(@params[:status])
    end

    it 'should return 400_915 if form is delete', rpdoc_example_key: 400_915, rpdoc_example_name: 'show public form failed (form deleted)' do
      @form.set_delete
      put @path, params: @params.to_json, headers: @headers
      expect(response).to have_http_status(400)
      expect(json['error_code']).to eq(400_915)
      expect(json['error_key']).to eq('form_is_deleted')
    end

    it 'should return 400_919 if form status invalid', rpdoc_example_key: 400_919, rpdoc_example_name: 'show public form failed (invalid form status)' do
      @params[:status] = 'invalid'
      put @path, params: @params.to_json, headers: @headers
      expect(response).to have_http_status(400)
      expect(json['error_code']).to eq(400_919)
      expect(json['error_key']).to eq('invalid_form_status')
    end

    it 'should return 400_920 if form template not usable', rpdoc_example_key: 400_919, rpdoc_example_name: 'show public form failed (form template not usable)' do
      @params[:status] = 'publish'
      @form.terminated!
      put @path, params: @params.to_json, headers: @headers
      expect(response).to have_http_status(400)
      expect(json['error_code']).to eq(400_920)
      expect(json['error_key']).to eq('form_template_not_usable')
    end

    it 'should return 400_921 if form reach limit', rpdoc_example_key: 400_919, rpdoc_example_name: 'show public form failed (form reach limit)' do
      @params[:status] = 'publish'
      @form.update(end_at: 1.hours.ago)
      put @path, params: @params.to_json, headers: @headers
      expect(response).to have_http_status(400)
      expect(json['error_code']).to eq(400_921)
      expect(json['error_key']).to eq('form_reach_limit')
    end

  end
end
