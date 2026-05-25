# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Api::V1::PublicFormsController, type: :request do
  include_context 'rpdoc'

  before(:each) do |example|
    example.metadata[:rpdoc_action_key] = 'export_csv'
    example.metadata[:rpdoc_action_name] = '匯出公開表單csv'
    example.metadata[:rpdoc_example_folders] = ['v1', 'public_forms']

    @member = mock_member(:member_me, skip_auth: example.metadata[:skip_auth])
    @form = FactoryBot.create(:public_form, owner: @member)
    @form.template.dummy_stages.last.destroy
    @form.update(signer_infos: @form.signer_infos[0...1])
    @form_task = setup_form_task(@form.reload)
    @form_task.completed!
    @form.unpublish!

    mock_headers(http_method: :get)
    @path = '/api/v1/public_forms/export_csv'
    @params = { form_id: @form.id }
  end

  describe '#export_csv' do
    it 'should return 200', rpdoc_example_key: 200, rpdoc_example_name: 'export public form csv success (without detail)' do
      get @path, params: @params, headers: @headers
      expect(response).to have_http_status(200)
      expect(response.headers['Content-Disposition'].start_with?('attachment')).to eq(true)
      expect(response.body).to include(@form_task.form_display_name)
    end

    it 'should return 404_043 if form not found', rpdoc_example_key: 404_043, rpdoc_example_name: 'export public form csv failed (form not exist)' do
      @params[:form_id] = -1
      get @path, params: @params, headers: @headers
      expect(response).to have_http_status(404)
      expect(json['error_code']).to eq(404_043)
      expect(json['error_key']).to eq('form_not_found')
    end

    it 'should return 400_915 if form is delete', rpdoc_example_key: 400_915, rpdoc_example_name: 'export public form csv failed (form deleted)' do
      @form.set_delete
      get @path, params: @params, headers: @headers
      expect(response).to have_http_status(400)
      expect(json['error_code']).to eq(400_915)
      expect(json['error_key']).to eq('form_is_deleted')
    end

    it 'should return 400_918 if form not unpublish', rpdoc_example_key: 400_918, rpdoc_example_name: 'export public form csv failed (form not unpublish)' do
      @form.publish!
      get @path, params: @params, headers: @headers
      expect(response).to have_http_status(400)
      expect(json['error_code']).to eq(400_918)
      expect(json['error_key']).to eq('form_should_unpublish')
    end
  end
end
