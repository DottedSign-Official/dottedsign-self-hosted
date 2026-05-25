class Api::V1::Developer::SignTasks::DeclineReasonsController < Api::V1::DeveloperController
  before_action :setup_decline_reason, only: [:update, :destroy]

  def index
    decline_reasons = DeclineReason.active_system_reserved

    serialize_response(:decline_reason, decline_reasons)
  end

  def create
    decline_reason = DeclineReason.new(decline_reason_params)
    decline_reason.save!

    serialize_response(:decline_reason, decline_reason)
  rescue => e
    error_response(:invalid_params, e.message)
  end

  def update
    @decline_reason.update!(decline_reason_params)

    serialize_response(:decline_reason, @decline_reason)
  rescue => e
    error_response(:invalid_params, e.message)
  end

  def destroy
    @decline_reason.deleted!
    success_response
  end

  private

  def setup_decline_reason
    @decline_reason = DeclineReason.find_by_id(params[:decline_reason_id])
    return error_response(:decline_reason_not_found) if @decline_reason.nil?
  end

  def decline_reason_params
    params.require(:content).strip!
    params[:system_reserved] = true
    params.permit(:content, :system_reserved)
  end
end
