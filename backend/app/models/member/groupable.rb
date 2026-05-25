module Member::Groupable
  extend ActiveSupport::Concern

  def generate_group(group_name='Default Group Name')
    return if group_id.present?
    ActiveRecord::Base.transaction do
      group = Group.create!(name: group_name)
      invite = group.add_member(self)
      invite.accept!
      self.reload
      group.assign_role(self, ['admin'])
    end
    group
  end

  def admin_of_group?(gid)
    return false if group_id.nil?
    return false unless group_id == gid
    roles.pluck(:name).include?('admin')
  end

  def manage_group?(gid)
    return false if group_id.nil?
    return false unless group_id == gid
    roles.pluck(:name).include?('admin') || roles.pluck(:name).include?('manager')
  end

  def group_roles(gid)
    roles.where(group_id: gid)
  end

  def group_accessible(gid, action)
    groles = group_roles(gid)
    allowed = false
    groles.each do |role|
      allowed = true if role.permission[action]
      break if allowed
    end
    allowed ? :accessible : :not_accessible
  end

  def current_permission
    role_permissions = current_roles.select(:name, :permission).map do |role|
      role_name = Settings.default.permissions.keys.include?(role.name) ? role.name : 'member'
      Settings.default.permissions[role_name].merge(role.permission)
    end

    role_permissions.reduce({}) do |permission, role_permission|
      permission.merge(role_permission) do |_, old_v, new_v|
        old_v || new_v
      end
    end
  end

end
