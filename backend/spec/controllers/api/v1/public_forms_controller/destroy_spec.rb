# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Api::V1::PublicFormsController, type: :request do
  include_context 'rpdoc'

  before(:each) do |example|
    example.metadata[:rpdoc_action_key] = 'destroy'
    example.metadata[:rpdoc_action_name] = '刪除公開表單'
    example.metadata[:rpdoc_example_folders] = ['v1', 'public_forms']

    @member = mock_member(:member_me, skip_auth: example.metadata[:skip_auth])
    @form = FactoryBot.create(:public_form, owner: @member)
    @form.unpublish!

    mock_headers
    @path = "/api/v1/public_forms/#{@form.id}"
  end

  describe '#destroy' do
    it 'should return 200', rpdoc_example_key: 200, rpdoc_example_name: 'destroy public form success' do
      delete @path, headers: @headers
      expect(response).to have_http_status(200)
      @form.reload
      expect(@form.is_deleted).to eq(true)
      expect(@form.template.deleted?).to eq(true)
    end

    it 'should return 404_043 if form not found', rpdoc_example_key: 404_043, rpdoc_example_name: 'destroy public form failed (form not exist)' do
      @path = '/api/v1/public_forms/-1'
      delete @path, headers: @headers
      expect(response).to have_http_status(404)
      expect(json['error_code']).to eq(404_043)
      expect(json['error_key']).to eq('form_not_found')
    end

    it 'should return 400_915 if form is delete', rpdoc_example_key: 400_915, rpdoc_example_name: 'destroy public form failed (form deleted)' do
      @form.set_delete
      delete @path, headers: @headers
      expect(response).to have_http_status(400)
      expect(json['error_code']).to eq(400_915)
      expect(json['error_key']).to eq('form_is_deleted')
    end

    it 'should return 400_918 if form not unpublish', rpdoc_example_key: 400_918, rpdoc_example_name: 'destroy public form failed (form not unpublish)' do
      @form.publish!
      delete @path, headers: @headers
      expect(response).to have_http_status(400)
      expect(json['error_code']).to eq(400_918)
      expect(json['error_key']).to eq('form_should_unpublish')
    end
  end
end
