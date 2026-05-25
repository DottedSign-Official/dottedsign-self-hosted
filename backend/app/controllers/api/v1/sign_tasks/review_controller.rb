class Api::V1::SignTasks::ReviewController < Api::ApplicationController
  # authentication for quick sign (in CodeAuthenticationHelper)
  prepend_before_action :allow_code_authentication_strategy

  before_action :security_checked
  before_action :check_code_params_match!
  before_action :check_stage_done!
  before_action :check_acceptance!

  def review
    review = Normal::Review.call(params.require(:sign_task_id), current_member, review_params, client_params)
    return error_response(review.error.key, review.error.message, review.error.error_obj) unless review.success?
    serialize_response(:sign_task, review.task)
  end

  def confirm
    confirm = Normal::Confirm.call(params.require(:sign_task_id), current_member, confirm_params, client_params)
    return error_response(confirm.error.key, confirm.error.message, confirm.error.error_obj) unless confirm.success?
    serialize_response(:sign_task, confirm.task)
  end

  private

  def review_params
    params.permit(:review_message, review_fields: [:field_object_id, :accepted], review_attachments: [:attachment_id, :accepted])
  end

  def confirm_params
    params.permit(:code, verify_info: verify_info_permit_attrs)
  end

end
