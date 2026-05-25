module Combination::Shareable
  extend ActiveSupport::Concern

  included do
    has_many :share_settings, as: :shared, dependent: :destroy
  end

  def share(role_permissions)
    role_map = group.roles.index_by(&:name)
    role_permissions.each do |role_name, should_share|
      role = role_map[role_name]
      next unless role

      should_share ? ShareSetting.setup(self, role) : ShareSetting.remove(self, role)
    end
  end

  def share_detail
    default_role_permissions = Settings.default.combination_share_access
    return default_role_permissions if group.nil?

    custom_role_permissions = group.custom_roles.index_with { false }
    shared_role_permissions = Role.where(id: share_settings.pluck(:target_id)).pluck(:name).index_with { true }
    { group_share: custom_role_permissions.merge(default_role_permissions['group_share']).merge(shared_role_permissions) }
  end

  def share_info(member)
    {
      share_by_me: owner_id == member.id && self.share_settings.present?,
      share_by_others: owner_id != member.id
    }
  end
end
