class Api::V1::SignTaskListEntity < BaseEntity
  present_collection true

  expose :task_entities, as: :tasks
  expose :summary
  expose :current_page
  expose :total_pages

  def pagination_items
    object[:items]
  end

  def task_entities
    @task_entities ||= Api::V1::SignTaskEntity.represent(pagination_items, options)
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
