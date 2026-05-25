module TaskHelper

  def setup_task
    envelope_id = (params[:envelope_id] || @code_info&.dig('envelope_id'))&.to_i
    @envelope = Envelope.find_by_id(envelope_id)
    return error_response(:envelope_not_found) if envelope_id.present? && @envelope.nil?

    @task = @envelope.present? ? @envelope.first_task : SignTask.find_by_id((params[:sign_task_id] || @code_info['task_id'] ||@token_info['task_id']).to_i)
    return error_response(:task_not_found) if @task.nil?

    @source = @envelope || @task
  end

  def task_detail_info
    @envelope ||= Envelope.find_by_id(params[:envelope_id] || code_info['envelope_id'].to_i)
    @task ||= SignTask.find_by_id((params[:sign_task_id] || code_info['task_id'].to_i))
    source = @envelope || @task
    {
      task_status: source&.status,
      signer_email: current_member.email,
      actor_name: current_member.display_name,
      owner_email: source&.owner.email,
      owner_name: source&.owner.display_name
    }
  rescue StandardError
    {}
  end

  def task_infos_of_category(category, pagination_info)
    category_ids, _filter_ids = get_category_and_filter_ids(category)
    paginated_tasks, mixed_task_infos = prepare_mixed_task_infos(category_ids[category.to_sym], category, pagination_info)
    {
      tasks: mixed_task_infos,
      summary: category_ids.transform_values { |value| value[:all].length },
      current_page: paginated_tasks.current_page,
      total_pages: paginated_tasks.total_pages
    }
  end

  def task_infos_of_filter(category, filter, pagination_info)
    category_ids, filter_ids = get_category_and_filter_ids(category)
    paginated_tasks, mixed_task_infos = prepare_mixed_task_infos(filter_ids[filter.to_sym], category, pagination_info)
    {
      tasks: mixed_task_infos,
      summary: category_ids.transform_values { |value| value[:all].length },
      current_page: paginated_tasks.current_page,
      total_pages: paginated_tasks.total_pages
    }
  end

  def group_classified_task_ids_by_envelope(classified_ids)
    # 屬於相同信封的任務只保留一筆，確保信封與任務混合計算時，各類型資料總數＆撈資料分頁數量正確
    classified_ids.map do |category, task_ids|
      with_envelope, without_envelope = SignTask.group_task_ids_by_envelope(task_ids)
      [category, { with_envelope: with_envelope, without_envelope: without_envelope, all: with_envelope + without_envelope }]
    end.to_h
  end

  private

  def not_consent_error
    action_name == 'read' ? :quick_sign_not_accepted : :other_has_accepted_to_quick_sign
  end

  def display_order(category)
    SignTask.category_display_order(category)
  end

  def get_category_and_filter_ids(category)
    task_ids = SignTask.related_ids(current_member) & SignTask.non_form.pluck(:id)
    category_ids = SignTask.category_ids(task_ids, current_member.id)
    filter_ids = SignTask.filter_ids(category_ids[category.to_sym], current_member.id)
    return group_classified_task_ids_by_envelope(category_ids), group_classified_task_ids_by_envelope(filter_ids)
  end

  def prepare_mixed_task_infos(classified_ids, order_category, pagination_info)
    paginated_tasks = SignTask.where(id: classified_ids[:all]).send(display_order(order_category)).page(pagination_info[:page] || 1).per(pagination_info[:per_page] || SignTask::PER_PAGE)
    SignTask.prepare_mixed_task_infos(paginated_tasks, classified_ids[:without_envelope], current_member.id)
  end

end
