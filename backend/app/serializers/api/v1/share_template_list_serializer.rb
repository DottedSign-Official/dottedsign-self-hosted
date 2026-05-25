class Api::V1::ShareTemplateListSerializer < BaseSerializer
  entity Api::V1::ShareTemplateListEntity


  protected

  def association_array
    [
      :shared,
      :target
    ]
  end
end
