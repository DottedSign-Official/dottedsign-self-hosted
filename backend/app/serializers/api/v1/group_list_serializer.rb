class Api::V1::GroupListSerializer < BaseSerializer
  entity Api::V1::GroupListEntity

  def association_array
    [
      :members
    ]
  end
end
