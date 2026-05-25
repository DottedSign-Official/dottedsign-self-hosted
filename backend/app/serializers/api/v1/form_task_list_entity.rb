class Api::V1::FormTaskListEntity < ListEntity
  expose :form_task_entities, as: :tasks
  expose :summary

  private

  def form_task_entities
    @form_task_entities ||= Api::V1::FormTaskEntity.represent(pagination_items, options.merge({ batch: true }))
  end

  def summary
    options[:summary] || {}
  end
end
