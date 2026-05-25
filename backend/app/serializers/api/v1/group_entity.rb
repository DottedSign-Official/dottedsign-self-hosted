class Api::V1::GroupEntity < BaseEntity
  expose :id, as: :group_id
  expose :name
  expose :unique_name
  expose :status
  expose :members, using: Api::V1::MemberEntity, if: { show_members: true }

end
