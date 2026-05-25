class Api::V1::PublicFormSerializer < GrapeSerializer
  entity Api::V1::PublicFormEntity

  protected

  def association_array
    [
      :owner,
      :completed_tasks,
      :template
    ]
  end

end
