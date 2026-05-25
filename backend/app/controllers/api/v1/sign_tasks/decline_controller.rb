class Api::V1::SignTasks::DeclineController < Api::ApplicationController
  # authentication for quick sign (in CodeAuthenticationHelper)
  prepend_before_action :allow_code_authentication_strategy

  before_action :security_checked
  before_action :check_code_params_match!
  before_action :check_stage_done!
  before_action :check_acceptance!

  def decline
    decline_service = params[:envelope_id].present? ? Envelopes::Decline.call(params[:envelope_id], current_member, decline_params, client_params)
                                                    : Normal::Decline.call(params[:sign_task_id], current_member, decline_params, client_params)
    if decline_service.success?
      success_response(decline_service.result)
    else
      error_response(decline_service.error.key, decline_service.error.message)
    end
  end

  private

  def decline_params
    params.require([:reply_to])
    params.permit(:decline_reason_id, :reason, :message, reply_to: [])
  end

end
