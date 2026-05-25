class Api::V1::TemplateListEntity < BaseEntity
  present_collection true

  expose :template_entities, as: :templates
  expose :summary
  expose :current_page
  expose :total_pages

  def pagination_items
    object[:items]
  end

  def template_entities
    @template_entities ||= Api::V1::TemplateEntity.represent(pagination_items, options)
  end

  def summary
    options[:summary].transform_values(&:length)
  end

  def current_page
    pagination_items.current_page
  end

  def total_pages
    pagination_items.total_pages
  end

end
