class Api::V1::Envelopes::ChangeController < Api::ApplicationController
  before_action -> { check_email(params.dig(:new_owner, :email)) }, only: [:change_owner]
  before_action :setup_task, only: [:change_owner]
  def change_owner
    change_service = OwnerChange.call(change_owner_params, source: @envelope, actor: current_member)    
    return error_response(change_service.error.key) unless change_service.success?

    success_response(change_service.result)
  end

  private

  def change_owner_params
    params.require(:new_owner).require(:email)
    params.permit(new_owner: [:email])
  end
end