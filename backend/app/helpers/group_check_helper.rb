module GroupCheckHelper

  def setup_group
    @group = Group.find_by_id(params[:group_id])
    return error_response(:group_not_found) if @group.nil?
  end

  def check_group_feature
    error_response(:no_group_feature) unless GROUP_USE
  end

  def check_group(action_name)
    error_response(:group_not_accessible) unless current_member.group_accessible(@group.id, action_name) == :accessible
  end

  def check_group_in_belong
    error_response(:group_not_belong) unless current_member.group_id == @group.id
  end

  def check_group_show
    group_show_accessible = current_member.group_accessible(@group.id, 'view_users')
    return error_response(:group_not_accessible) if group_show_accessible != :accessible
    @show_members = true
  end

  def check_group_update
    check_group('manage_company_name')
  end

  def check_group_upload
    check_group('manage_company_logo')
  end

  def check_group_manage_user
    return if action_name == 'remove_member' && current_member.email == params[:email]
    check_group('manage_users')
  end

  def check_group_manage_permission
    check_group('manage_permission')
  end

  def check_group_view_tasks
    check_group('view_team_tasks')
  end

end
