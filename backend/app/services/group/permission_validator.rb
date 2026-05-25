class Group::PermissionValidator < ServiceCaller
  def initialize(permission)
    @permission = permission
  end

  def call
    check_permission_interlocking
    check_permission_exceeded
  end

  private

  def check_permission_interlocking
    @interlocking_list = []
    check_view_team_tasks
    check_report_access

    if @interlocking_list.present?
      raise ServiceError.new(:permission_interlocking,
                             error_message: "interlocking_list: #{@interlocking_list}")
    end
  end

  def check_view_team_tasks
    if @permission['view_team_tasks'] == true && @permission['view_users'] == false
      @interlocking_list << 'view_users' << 'view_team_tasks'
    end
  end

  def check_report_access
    if @permission['report_access'] == true && @permission['view_users'] == false
      @interlocking_list << 'view_users' << 'report_access'
    end
  end

  def check_permission_exceeded
    @invalid_actions = []
    @permission.each do |action, value|
      if allowed_max_permission[action] == false && value == true
        @invalid_actions << action
      end
    end

    if @invalid_actions.present?
      raise ServiceError.new(:invalid_permission,
                             error_message: "invalid_actions: #{@invalid_actions}")
    end
  end

  def allowed_max_permission
    Settings.default.permissions[:manager]
  end
end
