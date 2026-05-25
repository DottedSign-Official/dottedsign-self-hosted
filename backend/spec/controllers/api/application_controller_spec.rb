require "rails_helper"

RSpec.describe Api::ApplicationController, type: :controller do
  controller do
    prepend_before_action :allow_code_authentication_strategy

    def api_for_register_freeable; end
  end

  before(:each) do
    routes.draw do
      namespace :api do
        scope module: :application do
          get 'api_for_register_freeable'
        end
      end
    end
  end

  describe '#allow_code_authentication_strategy' do
    before(:each) do
      @path = :api_for_register_freeable
    end

    it 'should return 400003 if member is invalid' do
      task = FactoryBot.create(:quick_sign_task)
      params = {
        code: task.original_file.preview_code(task.processing_stages[0], will_expired: true)
      }
      Member.destroy_all
      
      get @path, params: params
      expect(response).to have_http_status(400)
      expect(json['error_code']).to eq(400003)
    end

    it 'should return 400061 if code is invalid' do      
      get @path, params: {code: 'invalid.preview.code'}
      expect(response).to have_http_status(400)
      expect(json['error_code']).to eq(400061)
    end

    it 'should return 401030 if member needs login first' do
      task = FactoryBot.create(:waiting_for_me1)
      params = {
        code: task.original_file.preview_code(task.processing_stages[0], will_expired: true)
      }
      
      get @path, params: params
      expect(response).to have_http_status(401)
      expect(json['error_code']).to eq(401030)
    end

    it 'should return 403035 if code is already expired' do
      task = FactoryBot.create(:quick_sign_task)
      params = {
        code: task.original_file.preview_code(task.processing_stages[0], will_expired: true)
      }
      mock_current_time(3.days.after)
      
      get @path, params: params
      expect(response).to have_http_status(403)
      expect(json['error_code']).to eq(403035)
    end
  end
end