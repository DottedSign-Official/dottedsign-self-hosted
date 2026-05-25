class Api::V1::MemberEntity < BaseEntity
  expose :id
  expose :email
  expose :name
  expose :status
  expose :profile, using: Api::V1::ProfileEntity
  expose :group, using: Api::V1::GroupEntity, if: { show_group_info: true }
  expose :group_permission

  alias :member :object

  def group_permission
    member.roles || []
  end
end
