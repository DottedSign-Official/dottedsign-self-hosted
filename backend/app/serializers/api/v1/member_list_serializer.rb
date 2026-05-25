class Api::V1::MemberListSerializer < BaseSerializer
  entity Api::V1::MemberListEntity

  protected

  def association_array
    [
      :group
    ]
  end
end
