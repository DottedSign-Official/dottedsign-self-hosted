class Api::V1::Developer::GroupsController < Api::V1::DeveloperController
  before_action -> { check_email(params[:assignee_email]) }, only: [:assign_member_to_group, :change_member_role_in_group]

  def index
    group_service = Group::ObtainList.call(params[:search_group_name], params[:page], params[:per_page])
    serialize_response(:group_list, group_service.result, show_members: true)
  end

  def create
    Group.create!(name: params.require(:group_name))
    success_response("ok")
  end

  def update
    Group.find(update_params[:group_id]).update!(name: update_params[:group_name])
    success_response("ok")
  end

  def assign_member_to_group
    member = Member.find_by(email: assign_params[:assignee_email], is_registered: true)
    group = Group.find(assign_params[:group_id])

    return error_response(:invalid_params) unless Role::RESERVED_NAME.include?(assign_params[:role].to_sym)
    return error_response(:member_not_found) if member.nil?
    return error_response(:already_in_group) if member.group_id.present?
    return error_response(:group_not_found) if group.nil?

    invite = group.add_member(member)
    invite.accept!
    member.reload
    group.assign_role(member, [assign_params[:role]])
    success_response("ok")
  end

  def remove_member_from_group
    member = Member.find_by(email: params[:assignee_email], is_registered: true)
    group = Group.find(params[:group_id])
    return error_response(:member_not_found) if member.nil?
    return error_response(:group_not_found) if group.nil?
    group.remove_member(member)
    success_response("ok")
  end

  def change_member_role_in_group
    member = Member.find_by(email: change_role_params[:assignee_email], is_registered: true)
    group = member.group
    return error_response(:member_not_found) if member.nil?
    return error_response(:group_not_found) if group.nil?
    group.assign_role(member, change_role_params[:roles])
    success_response("ok")
  end

  private

  def update_params
    require_attrs = [:group_id, :group_name]
    params.require(require_attrs)
    params.permit(*require_attrs)
  end

  def assign_params
    require_attrs = [:group_id, :assignee_email, :role]
    params.require(require_attrs)
    params.permit(*require_attrs)
  end

  def change_role_params
    require_attrs = [:assignee_email, :roles]
    params.require(require_attrs)
    params.permit(:assignee_email, roles: [])
  end

end
