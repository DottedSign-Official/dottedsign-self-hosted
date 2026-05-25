class Api::V1::Templates::ShareSettingsController < Api::ApplicationController
  before_action :check_and_setup_template, only: [:share_template, :admin_share, :admin_remove_share]
  before_action :check_owner_template, only: [:share_template]
  before_action :check_template_share_group_accessible, only: [:admin_share, :admin_remove_share]
  before_action :check_group_admin, only: [:admin_share, :admin_remove_share, :share_list]

  def share_template
    return error_response(:group_not_found) unless current_member.active_group_id.present?
    group = Group.find_by(id: current_member.active_group_id)
    return error_response(:group_not_found) if group.nil?
    ShareSetting.setup(@template, group)
    success_response("ok")
  end

  def admin_share
    return error_response(:no_permission) unless @template.owner.group_id == current_member.active_group_id
    return error_response(:group_not_found) unless current_member.active_group_id.present?
    groups = Group.where(id: params[:group_ids])
    ActiveRecord::Base.transaction do
      groups.each { |group| ShareSetting.setup(@template, group) }
    end
    success_response("ok")
  end

  def admin_remove_share
    group = Group.find_by(id: remove_share_params[:group_id])
    return error_response(:group_not_found) if group.nil?
    return error_response(:no_permission) unless remove_share_permission?
    return error_response(:shared_template_has_other_groups) unless can_remove_self_share?(group)
    return error_response(:no_permission) unless can_remove_other_share?(group)

    ShareSetting.remove(@template, group)
    success_response("ok")
  end

  def share_list
    return error_response(:group_not_found) unless current_member.active_group_id.present?
    service = TemplateShareList.call(current_member, params[:filter_type],params[:page], params[:per_page])
    return error_response(service.error.key) if service.failed?
    serialize_response(:share_template_list, service.share_list, self_group_share_template_ids: service.self_group_share_template_ids, self_template_groups_dictionary: service.self_template_groups_dictionary)
  end

  private

  def remove_share_permission?
    return true if current_member.active_group_id == remove_share_params[:group_id] || @template.owner.group_id == current_member.active_group_id
    false
  end

  def can_remove_self_share?(remove_group)
    if @template.owner.group_id == current_member.active_group_id && @template.owner.group_id == remove_group.id
      return false if ShareSetting.where(shared: @template).count > 1
    end
    true
  end

  def can_remove_other_share?(remove_group)
    return false if @template.owner.group_id != current_member.active_group_id && remove_group.id != current_member.active_group_id
    true
  end

  def remove_share_params
    require_attrs = [:group_id, :template_id]
    params.require(require_attrs)
    params.permit(*require_attrs)
  end
end
