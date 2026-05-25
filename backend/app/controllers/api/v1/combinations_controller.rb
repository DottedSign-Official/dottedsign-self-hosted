class Api::V1::CombinationsController < Api::ApplicationController
  before_action :security_checked
  before_action :check_combination_params, only: [:create, :update]
  before_action :setup_combination, only: [:show, :update, :destroy, :group_share, :share_info]

  def list
    combinations = Combination.related_to(current_member)
    combinations = combinations.where(quantity: params[:quantity].to_i) if params[:quantity].present?
    combinations = combinations.page(params[:page] || 1).per(params[:per_page] || Combination::PER_PAGE)
    serialize_response(:combination_list, combinations)
  end

  def show
    serialize_response(:combination, @combination)
  end

  def create
    creator = Factories::Combination::Base.call(current_member, combination_params)
    return error_response(creator.error.key, creator.error.message) if creator.failed?
    serialize_response(:combination, creator.result)
  end

  def update
    updater = Factories::Combination::BaseUpdate.call(current_member, @combination, combination_params)
    return error_response(updater.error.key, updater.error.message) if updater.failed?
    serialize_response(:combination, updater.result)
  end

  def destroy
    if @combination.destroy
      success_response(:ok)
    else
      error_response(:delete_combination_failed, @combination.errors.full_messages)
    end
  end

  def group_share
    @combination.share(group_permission_params)
    success_response(:ok)
  rescue ServiceError
    error_response(:share_combination_failed)
  end

  def share_info
    success_response(@combination.share_detail)
  end

  private

  def check_combination_params
    # TODO: 檢查與退回相關程式碼待功能完成後再加入
    # with_editor = params[:stages]&.any? { |stage_params| stage_params[:stage_type] == 'edit' }
    params[:stages]&.each do |stage_params|
      check_email(stage_params[:email], check_options: [:domain]) if stage_params[:email].present?
      # check_verify_method_batch_params(stage_params[:verify], source: 'Combination', with_editor: true) if with_editor
    end
  end

  def setup_combination
    @combination = Combination.find_by(id: params[:combination_id] || params[:id])
    return error_response(:combination_not_found) if @combination.nil?
    return error_response(:combination_not_accessible) unless @combination.accessibility_of(current_member, check_action: action_name) == :accessible
  end

  def combination_params
    params.permit(:name, :description, :has_order, stages: stage_permit_attrs)
  end

  def stage_permit_attrs
    [:email, :name, stage_setting: stage_setting_attrs, verify: verify_attrs]
  end

  def group_permission_params
    group_permission = params.require(:group_permission)
    group_custom_roles = Group.find_by(id: current_member.active_group_id)&.custom_roles || []
    group_permission.permit(:admin, :manager, :member, *group_custom_roles.map(&:to_sym))
  end
end