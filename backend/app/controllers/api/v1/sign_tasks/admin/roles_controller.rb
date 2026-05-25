class Api::V1::SignTasks::Admin::RolesController < Api::ApplicationController
  include GroupCheckHelper

  before_action :check_group_feature
  before_action :setup_group
  before_action :check_group_in_belong, except: [:index]
  before_action :check_group_admin, except: [:index]

  def index
    roles = @group.roles.order(priority: :asc)

    serialize_response(:role_list, roles)
  end

  def create
    role = Role.find_or_initialize_by(group_id: @group.id, name: role_params[:name])
    return error_response(:duplicate_role_name) unless role.new_record?

    validator = Group::PermissionValidator.call(role_params[:permission])
    return error_response(validator.error.key, validator.error.message) if validator.failed?

    role.permission = Settings.default.permissions[:member].merge(role_params[:permission])
    role.priority = @group.roles.count + 1
    role.save!

    serialize_response(:role, role)
  end

  def destroy
    role = @group.roles.find_by(id: params[:role_id])
    return error_response(:role_not_found) if role.nil?
    return error_response(:role_not_allow_to_delete) if role.reserved?
    return error_response(:role_is_assigned) unless role.members.empty?

    role.destroy
    success_response
  end

  def change_priorities
    @group.roles.change_priorities(params.require(:role_ids))
    success_response
  end

  private

  def check_group_admin
    error_response(:member_not_group_admin) unless current_member.admin_of_group?(@group.id)
  end

  def role_params
    params.require(%i[name permission])
    params.permit(:name, permission: [*Settings.default.permissions[:admin]])
  end
end
