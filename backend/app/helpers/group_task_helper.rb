require 'csv'

module GroupTaskHelper

  def group_task_infos_of_category(category)
    category_ids = group_classified_task_ids_by_envelope(admin_category_ids)
    paginated_tasks, mixed_task_infos = prepare_mixed_task_infos(category_ids[category.to_sym], pagination_params)
    {
      tasks: mixed_task_infos,
      summary: category_ids.transform_values { |value| value[:all].length },
      current_page: paginated_tasks.current_page,
      total_pages: paginated_tasks.total_pages
    }
  end

  def search_group_related_task_ids
    task_ids = SignTask.group_related_ids(current_member.group_id, @member_ids)
    date_range = format_time_range
    task_ids = SignTask.where(id: task_ids).search_by_date_range(date_range) if date_range.present?
    task_ids
  end

  def admin_category_ids
    task_ids = search_group_related_task_ids
    SignTask.group_category_ids(task_ids, current_member.group_id)
  end

  def get_export_group_tasks
    if params[:category].nil?
      task_ids = search_group_related_task_ids
    else
      task_ids = admin_category_ids[params[:category].to_sym]
    end
    SignTask.where(id: task_ids).action_display_order(params[:sort_type], order_by: params[:order_by])
  end

  def format_tasks_csv_string(tasks)
    time_zone = TimezoneMapping[:hour_zone][params[:zone].to_f]
    CSV.generate do |csv|
      csv << ['Envelope ID', 'Envelope Name', 'Task ID', 'Task Name', "Sender's Name", "Sender's Email", 'Created Time', 'Task Status', 'Last Modified Time']
      tasks.includes(:envelope, :owner, :modified_events).each do |task|
        envelope_id = task.envelope_id || ''
        envelope_name = task.envelope&.envelope_name || ''
        last_modified_at = task.last_modified_at
        modified_display = last_modified_at.blank? ? '' : Time.at(last_modified_at).in_time_zone(time_zone).strftime('%Y-%m-%d %H:%M:%S %Z')
        created_display = task.created_at.in_time_zone(time_zone).strftime('%Y-%m-%d %H:%M:%S %Z')
        csv << [envelope_id, envelope_name, task.id, task.file_name, task.owner.display_name, task.owner.email, created_display, task.status, modified_display]
      end if tasks.present?
    end
  end

  private

  def prepare_mixed_task_infos(classified_ids, pagination_info)
    paginated_tasks = SignTask.where(id: classified_ids[:all]).action_display_order(params[:sort_type], order_by: params[:order_by]).page(pagination_info[:page] || 1).per(pagination_info[:per_page] || SignTask::PER_PAGE)
    SignTask.prepare_mixed_task_infos(paginated_tasks, classified_ids[:without_envelope], current_member.id)
  end

end
