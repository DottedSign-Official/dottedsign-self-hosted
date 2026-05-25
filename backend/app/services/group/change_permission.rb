class Group::ChangePermission < ServiceCaller
  def initialize(group, member, permissions)
    @group = group
    @member = member
    @role_hash = permissions.map { |rp| [rp.delete(:role), rp] }.to_h
  end

  def call
    Role.transaction do
      @group.roles.where(name: @role_hash.keys).each do |role|
        check_admin(role)
        check_priority(role)

        validator = Group::PermissionValidator.call(@role_hash[role.name])
        raise validator.error if validator.failed?

        role.permission.merge!(@role_hash[role.name])
        role.save
      end
    end
  end

  private

  def check_admin(role)
    if role.admin?
      raise ServiceError.new(:invalid_permission,
                             error_message: 'role: `admin` is reserved')
    end
  end

  def check_priority(role)
    priority = @member.current_roles.pluck(:priority).min
    if priority >= role.priority
      raise ServiceError.new(:invalid_permission,
                             error_message: "not allowed to modify role: #{role}")
    end
  end
end
