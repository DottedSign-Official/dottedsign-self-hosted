class Api::V1::MemberListEntity < BaseEntity
  present_collection true

  expose :member_entities, as: :members
  expose :total_count
  expose :current_page
  expose :total_pages

  private

  def pagination_items
    object[:items]
  end

  def member_entities
    @member_entities ||= Api::V1::MemberEntity.represent(pagination_items, options)
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
