class Api::V1::RoleEntity < BaseEntity
  expose :id, as: :role_id, unless: { simplified: true }

  expose :name

  expose :permission do |role|
    role_name = Settings.default.permissions.keys.include?(role.name) ? role.name : 'member'
    Settings.default.permissions[role_name].merge(role.permission)
  end

  expose :priority, unless: { simplified: true }
end
