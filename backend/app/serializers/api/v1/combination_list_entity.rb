class Api::V1::CombinationListEntity < BaseEntity
  present_collection true

  expose :combination_entities, as: :combinations
  expose :total_count
  expose :current_page
  expose :total_pages

  private

  def combination_entities
    @combination_entities ||= Api::V1::CombinationEntity.represent(pagination_items, options.merge({ batch: true }))
  end

  def pagination_items
    object[:items]
  end

  def total_count
    pagination_items.total_count
  end

  def current_page
    pagination_items.current_page
  end

  def total_pages
    pagination_items.total_pages
  end
end
