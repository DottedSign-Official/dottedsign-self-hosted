class Api::V1::GroupSerializer < BaseSerializer
  entity Api::V1::GroupEntity

  def association_array
    [
      :members
    ]
  end

end
