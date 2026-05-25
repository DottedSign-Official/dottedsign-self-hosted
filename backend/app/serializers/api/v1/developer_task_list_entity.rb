class Api::V1::DeveloperTaskListEntity < BaseEntity

  present_collection true

  expose :developer_task_detail_entities, as: :task_infos
  expose :total_count
  expose :current_page
  expose :total_pages

  def pagination_items
    object[:items]
  end

  def developer_task_detail_entities
    @task_entities ||= Api::V1::DeveloperTaskDetailEntity.represent(pagination_items, options)
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
