class Api::V1::Groups::SignTasks::DeclineReasonsController < Api::V1::GroupsController
  skip_before_action :check_group_update, only: [:update]
  before_action :setup_group
  before_action :check_group_in_belong
  before_action :setup_decline_reason, only: [:update, :destroy]
  before_action -> { check_group("manage_decline_reasons") }

  def index
    serialize_response(:decline_reason, @group.active_system_and_group_decline_reasons)
  end

  def create
    decline_reason = DeclineReason.find_or_create_by!(decline_reason_params)
    group_decline_reason = GroupDeclineReason.new(group: @group, decline_reason: decline_reason)
    group_decline_reason.save!

    serialize_response(:decline_reason, decline_reason)
  rescue => e
    error_response(:invalid_params, e.message)
  end

  def update
    new_decline_reason = DeclineReason.find_or_create_by!(decline_reason_params)
    GroupDeclineReason.find_by(group: @group, decline_reason: @decline_reason).update!(decline_reason: new_decline_reason)
    @decline_reason.check_associated_with_group

    serialize_response(:decline_reason, new_decline_reason)
  rescue => e
    error_response(:invalid_params, e.message)
  end

  def destroy
    if @decline_reason.groups.count >= 2
      @group.decline_reasons.delete(@decline_reason)
    else
      @decline_reason.destroy
    end

    success_response
  end

  private

  def setup_decline_reason
    @decline_reason = DeclineReason.find_by_id(params[:decline_reason_id])
    return error_response(:decline_reason_not_found) if @decline_reason.nil?
  end

  def decline_reason_params
    params.require(:content).strip!
    params[:system_reserved] = false
    params.permit(:content, :system_reserved)
  end
end
