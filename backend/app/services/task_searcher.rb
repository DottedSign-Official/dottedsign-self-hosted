class TaskSearcher < ServiceCaller
  def initialize(member, search_params, pagination_params)
    @member = member
    @search_params = search_params
    @page = pagination_params[:page] || 1
    @per_page = pagination_params[:per_page] || SignTask::PER_PAGE
  end

  def call
    search_by_requirement
    @result = create_search_response
  end

  private

  def search_by_requirement
    case @search_params[:target]
    when 'document', 'recipient'
      search_tasks_and_envelopes
    when 'envelope'
      search_envelopes
    else
      search_tasks_and_envelopes
    end
  end

  def search_tasks_and_envelopes
    @search_result = create_mixed_search_result
    @result_infos = create_mixed_result_infos
  end

  def search_envelopes
    @search_result = search_related_envelopes.display_order.page(@page).per(@per_page)
    @result_infos = @search_result.display_infos(@member.id)
  end

  def create_mixed_search_result
    task_ids = search_related_tasks.pluck(:id)
    envelope_ids = search_related_envelopes.pluck(:id)
    envelope_task_ids = Envelope.includes(:sign_tasks).where(id: envelope_ids).map { |envelope| envelope.first_task.id }
    @with_envelope_task_ids, @without_envelope_task_ids = SignTask.group_task_ids_by_envelope(task_ids + envelope_task_ids)
    SignTask.where(id: @with_envelope_task_ids + @without_envelope_task_ids).display_order.page(@page).per(@per_page)
  end

  def create_mixed_result_infos
    sorted_task_ids = @search_result.pluck(:id)
    paginated_task_ids = sorted_task_ids & @without_envelope_task_ids
    paginated_envelope_ids = @search_result.pluck(:envelope_id).compact
    SignTask.mix_and_sort_tasks(sorted_task_ids, paginated_task_ids, paginated_envelope_ids, @member.id)
  end

  def search_related_tasks
    task_ids = SignTask.independent.related_ids(@member)
    search_by_conditions(task_ids, SignTask)
  end

  def search_related_envelopes
    envelope_ids = Envelope.related_ids(@member)
    search_by_conditions(envelope_ids, Envelope)
  end

  def search_by_conditions(searchable_ids, searchable_class)
    searchable_ids &= searchable_class.search_related(@search_params[:target], @search_params[:terms]) if @search_params[:terms].present?

    date_range = format_time_range
    searchable_ids &= searchable_class.search_by_date_range(date_range) if date_range.present?

    searchable_ids &= searchable_class.search_by_tags(@search_params[:search_tags], @member) if @search_params[:search_tags].present?

    searchable_class.ready.where(id: searchable_ids)
  end

  def format_time_range
    return if @search_params[:start_from].blank? || @search_params[:end_at].blank?
    Time.parse(@search_params[:start_from]).beginning_of_day..Time.parse(@search_params[:end_at]).end_of_day
  end

  def create_search_response
    {
      tasks: @result_infos,
      total_count: @search_result.total_count,
      current_page: @search_result.current_page,
      total_pages: @search_result.total_pages
    }
  end
end