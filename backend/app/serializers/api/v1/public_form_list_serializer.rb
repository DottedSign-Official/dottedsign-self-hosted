class Api::V1::PublicFormListSerializer < GrapeSerializer
  entity Api::V1::PublicFormListEntity

  protected

  def association_array
    [
      :owner,
      :completed_tasks,
      :template
    ]
  end
end
