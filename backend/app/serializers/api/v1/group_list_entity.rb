class Api::V1::GroupListEntity < BaseEntity
  present_collection true

  expose :group_entities, as: :groups
  expose :total_count
  expose :current_page
  expose :total_pages

  private

  def pagination_items
    object[:items]
  end

  def group_entities
    @group_entities ||= Api::V1::GroupEntity.represent(pagination_items, options)
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
