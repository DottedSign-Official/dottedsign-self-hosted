class Api::V1::RoleListEntity < BaseEntity
  present_collection true

  expose :role_entities, as: :roles

  def items
    object[:items]
  end

  def role_entities
    @role_entities ||= Api::V1::RoleEntity.represent(items, options)
  end
end
