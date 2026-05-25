class Api::V1::MemberSerializer < BaseSerializer
  entity Api::V1::MemberEntity

  protected

  def association_array
    [
      :group,
      :roles
    ]
  end

end
