# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Api::V1::PublicFormsController, type: :request do
  include_context 'rpdoc'

  before(:each) do |example|
    example.metadata[:rpdoc_action_key] = 'index'
    example.metadata[:rpdoc_action_name] = '取得公開表單列表'
    example.metadata[:rpdoc_example_folders] = ['v1', 'public_forms']

    @member = mock_member(:member_me, skip_auth: example.metadata[:skip_auth])
    5.times{ FactoryBot.create(:public_form, owner: @member) }

    mock_headers
    @path = '/api/v1/public_forms'
  end

  describe '#index' do
    it 'should return 200', rpdoc_example_key: 200, rpdoc_example_name: 'list public form success' do
      get @path, headers: @headers
      expect(response).to have_http_status(200)
      expect(json['data']['forms'].length).to eq(5)
    end

    it 'should increase form list num if create a new form', rpdoc_skip: true do
      FactoryBot.create(:public_form, owner: @member)
      get @path, headers: @headers
      expect(response).to have_http_status(200)
      expect(json['data']['forms'].length).to eq(6)
    end
  end
end
