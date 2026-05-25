class Api::V1::SignTasks::SignController < Api::ApplicationController
  include PublicForms::FormTokenAuthenticationHelper

  # authentication for quick sign (in CodeAuthenticationHelper)
  prepend_before_action :allow_code_authentication_strategy

  # authentication for form signer (in PublicForms::FormTokenAuthenticationHelper)
  prepend_before_action :allow_form_token_authentication_strategy

  before_action :security_checked
  before_action :check_code_params_match!, only: [:consent, :sign, :trigger_verify, :reissue]
  before_action :check_stage_done!, only: [:sign, :trigger_verify]
  before_action :setup_task, except: [:sign, :gra_authorize_status, :reissue]
  before_action :check_accessibility, except: [:sign, :gra_authorize_status, :reissue]
  before_action :check_available, except: [:sign, :gra_authorize_status, :reissue]
  before_action :check_acceptance!, except: [:consent, :gra_authorize_status, :reissue]
  before_action :check_sign_signature_exist, only: [:sign]
  before_action :setup_stage, only: [:gra_authorize_status]
  def consent
    stage = @task.sign_stages.find_by_email(current_member.email)
    error_response(:stage_not_found) && return if stage.nil?

    cache_key = "#{params[:code]}:quick_sign_accept"
    if params[:check]
      cache_value = {
        accepted_at: Time.zone.now.to_i,
        client: params[:client],
        ip_address: params[:ip_address],
        work_id: params[:work_id]
      }
      Rails.cache.write(cache_key, cache_value, expires_in: ServiceFile::PREVIEW_EXPIRED_IN)
      success_response(cache_value)
    else
      Rails.cache.delete(cache_key)
      success_response(message: 'cancel agreement success')
    end
  end

  def sign
    sign_service = params[:envelope_id].present? ? Envelopes::Sign.call(params[:envelope_id].to_i, current_member, sign_params, client_params)
                                                 : Normal::Sign.call(params[:sign_task_id].to_i, current_member, sign_params, client_params)
    if sign_service.success?
      success_response(sign_service.result)
    elsif sign_service.error.error_obj.present?
      error_response(sign_service.error.key, sign_service.error.message, sign_service.error.error_obj)
    else
      error_response(sign_service.error.key, sign_service.error.message)
    end
  end

  def trigger_verify
    trigger = VerifyTrigger.call(@source, current_member.id, params.require(:uuid), params.require(:signer_email))
    if trigger.success?
      success_response(trigger.result)
    else
      error_response(trigger.error.key, trigger.error.message)
    end
  end

  def gra_authorize_status
    status = :ca_auth_failed
    if @stage.need_stage_cert?
      uuid = @stage.verify_methods[0]["uuid"]
      ca_auth = Rails.cache.read("ca_auth:#{uuid}")
      status = ca_auth.nil? ? :ca_auth_failed : :ca_auth_success
    end
    success_response(status: status)
  end

  def reissue
    reissue_service = Normal::Reissue.call(params[:sign_task_id], params[:stage_id], current_member, client_params)
    return error_response(reissue_service.error.key) if reissue_service.failed?

    success_response(:ok)
  end

  private

  def sign_params
    params.permit(:code, signature_info: sign_permit_attrs, verify_info: [:uuid, :verify_data], attachment_info: [:attachment_id, :attachment_type, :uploaded, :changed])
  end

  def check_sign_signature_exist
    check_signature_exist(params[:signature_info])
  end
end
