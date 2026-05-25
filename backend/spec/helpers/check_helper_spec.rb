require "rails_helper"

class AnonymousController < Api::ApplicationController
end

RSpec.describe AnonymousController, type: :controller do
  controller do
    before_action :security_checked
    before_action :setup_task, except: [:api_for_security_checked]
    before_action :check_task_ownership, only: [:api_for_check_task_ownership]
    before_action :check_task_accessibility, only: [:api_for_check_task_accessibility]
    before_action :check_task_available, only: [:api_for_check_task_available]

    def api_for_security_checked; end
    def api_for_set_up_task; end
    def api_for_check_task_ownership; end
    def api_for_check_task_accessibility; end
    def api_for_check_task_available; end
  end

  before(:each) do
    routes.draw do
      scope module: :anonymous do
        get 'api_for_security_checked'
        get 'api_for_set_up_task'
        get 'api_for_check_task_ownership'
        get 'api_for_check_task_accessibility'
        get 'api_for_check_task_available'
      end
    end
  end

  describe '#security_checked' do
    it 'should return 403031 if member is not confirmed' do
      mock_member(:not_confirmed_member)
      get :api_for_security_checked
      expect(response).to have_http_status(403)
      expect(json['error_code']).to eq(403031)
    end
  end

  describe '#setup_task' do
    it 'should return 404031 if task is not found' do
      mock_member(:member_me)
      task = FactoryBot.create(:completed_task1).destroy

      get :api_for_set_up_task, params: {sign_task_id: task.id}
      expect(response).to have_http_status(404)
      expect(json['error_code']).to eq(404031)
    end
  end

  describe '#check_task_ownership' do
    it 'should return 403033 if task is not owned' do
      mock_member(:member_me)
      task = FactoryBot.create(:waiting_for_me2)

      get :api_for_check_task_ownership, params: {sign_task_id: task.id}
      expect(response).to have_http_status(403)
      expect(json['error_code']).to eq(403033)
    end
  end

  describe '#check_task_accessibility' do
    it 'should return 403036 if task is not accessible' do
      mock_member(:member_me)
      task = FactoryBot.create(:not_related)

      get :api_for_check_task_accessibility, params: {sign_task_id: task.id}
      expect(response).to have_http_status(403)
      expect(json['error_code']).to eq(403036)
    end
  end

  describe '#check_task_available' do
    it 'should return 400033 if task is deleted' do
      mock_member(:member_me)
      task = FactoryBot.create(:deleted_task1)

      get :api_for_check_task_available, params: {sign_task_id: task.id}
      expect(response).to have_http_status(400)
      expect(json['error_code']).to eq(400033)
    end
  end
end


RSpec.describe AnonymousController, type: :controller do
  controller do
    prepend_before_action :allow_code_authentication_strategy
    before_action :security_checked
    before_action :check_code_params_match!
    before_action :check_stage_done!, only: [:api_for_check_stage_done]
    before_action :setup_task, only: [:api_for_check_acceptance]
    before_action :check_acceptance!, only: [:api_for_check_acceptance]

    def api_for_check_stage_done; end
    def api_for_check_acceptance; end
  end

  before(:each) do
    routes.draw do
      scope module: :anonymous do
        get 'api_for_check_stage_done'
        get 'api_for_check_acceptance'
      end
    end
  end

  describe '#check_stage_done!' do
    it 'should return 400046 if stage is completed' do
      task = FactoryBot.create(:quick_sign_waiting_for_other_task)
      params = {
        code: task.original_file.preview_code(task.sign_stages[0], will_expired: true)
      }

      get :api_for_check_stage_done, params: params
      expect(response).to have_http_status(400)
      expect(json['error_code']).to eq(400046)
    end
  end

  describe '#check_acceptance!' do
    it 'should return 403037 if quick sign is not accepted' do
      task = FactoryBot.create(:quick_sign_task)
      params = {
        code: task.original_file.preview_code(task.processing_stages[0], will_expired: true)
      }

      get :api_for_check_acceptance, params: params
      expect(response).to have_http_status(403)
      expect(json['error_code']).to eq(403037)
    end
  end
end
