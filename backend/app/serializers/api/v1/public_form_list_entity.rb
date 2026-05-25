class Api::V1::PublicFormListEntity < ListEntity
  expose :form_entities, as: :forms

  private

  def form_entities
    @form_entities ||= Api::V1::PublicFormEntity.represent(pagination_items, options.merge({ batch: true }))
  end
end
