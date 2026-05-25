class Api::V1::SignTasks::ChangeController < Api::ApplicationController
  # authentication for quick sign (in CodeAuthenticationHelper)
  prepend_before_action :allow_code_authentication_strategy, only: [:change_signer_requisition, :change_signer]

  before_action -> { check_email_if_present(params.dig(:new_signer, :email)) }, only: [:change_signer_requisition, :change_signer]
  before_action -> { check_email(params.dig(:new_owner, :email)) }, only: [:change_owner]
  before_action :setup_task, only: [:change_owner, :change_signer_requisition, :change_task_name]
  before_action :check_accessibility, only: [:change_signer_requisition]
  before_action :check_ownership, only: [:change_task_name]
  before_action :check_available, only: [:change_task_name]
  def change_signer_requisition
    task_owner = @source.owner
    token = @source.original_file.preview_code(will_expired: true, default_member_email: task_owner.email)
    MailCenter.delay.raise_if_server_failed('forward_request', task_owner.email, task_owner.display_name, current_member.display_name, current_member.email, @source.file_name, token, request_params, @source.receiver_lang)
    success_response(request_sent_to: @source.owner.display_name)
  end

  def change_signer
    change_service = SignerChange.call(stage_params, current_member.id, change_params, client_info: client_params)
    if change_service.success?
      success_response(change_service.result)
    else
      error_response(change_service.error.key)
    end
  end

  def change_owner
    change_service = OwnerChange.call(change_owner_params, source: @task, actor: current_member)

    return error_response(change_service.error.key) unless change_service.success?
    success_response(change_service.result)
  end

  def change_task_name
    if @envelope.present?
      @envelope.update!(envelope_name: params.require(:file_name))
    else
      @task.update!(file_name: params.require(:file_name))
    end
    success_response(:ok)
  end

  private

  def request_params
    params.require(:message) if params[:new_signer].blank?
    params.permit(:message, new_signer: [:email, :name])
  end

  def stage_params
    require_one_of(:envelope_id, :sign_task_id)
    params[:envelope_id].present? ? params[:stage_type] = 'DummyStage' : params[:stage_type] = 'SignStage'
    params.require(:stage_id)
    params.permit(:stage_id, :stage_type)
  end

  def change_params
    params.permit(:reason, new_signer: [:name, :email, :phone, :lang])
  end

  def change_owner_params
    params.require(:new_owner).require(:email)
    params.permit(new_owner: [:email])
  end
end
