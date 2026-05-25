module Developer
  class FilteredTaskList < ServiceCaller
    def initialize(list_params)
      @search_email = list_params[:search_email]
      @search_task_id = list_params[:search_task_id]
      @search_envelope_id = list_params[:search_envelope_id]
      @start_from = list_params[:start_from]
      @end_at = list_params[:end_at]
      @search_task_status = list_params[:search_task_status]
      @search_ca_status = list_params[:search_ca_status]
      @page = list_params[:page]
      @per_page = list_params[:per_page]
    end

    def call
      filtered_task = SignTask.all.includes(:envelope, :owner, :task_setting, :service_files, :sign_stages, sign_stages: [:service_files, :stage_setting, :verify_methods])
      filtered_task = apply_email_filter(filtered_task) if @search_email.present?
      filtered_task = apply_task_filter(filtered_task) if @search_task_id.present?
      filtered_task = apply_envelope_filter(filtered_task) if @search_envelope_id.present?
      filtered_task = apply_time_range_filter(filtered_task) if format_time_range.present?
      filtered_task = apply_task_status_filter(filtered_task) if @search_task_status.present?
      filtered_task = apply_ca_status_filter(filtered_task) if @search_ca_status.present?
      @result = filtered_task.order(id: :desc).page(@page || 1).per(@per_page || 50)
    end

    private

    def format_time_range
      return if @start_from.blank? || @end_at.blank?
      Time.parse(@start_from).beginning_of_day..Time.parse(@end_at).end_of_day
    end

    def apply_email_filter(filtered_task)
      member = Member.find_by(email: @search_email)
      return filtered_task.where(id: nil) if member.nil?
      owner_task_ids = member.sign_tasks.pluck(:id)
      actor_task_ids = SignStage.where(actor_id: member.id).pluck(:sign_task_id)
      task_ids = (owner_task_ids + actor_task_ids).compact.uniq.sort
      filtered_task.where(id: task_ids)
    end

    def apply_task_filter(filtered_task)
      filtered_task.where(id: @search_task_id)
    end

    def apply_envelope_filter(filtered_task)
      filtered_task.where(envelope_id: @search_envelope_id)
    end

    def apply_time_range_filter(filtered_task)
      filtered_task.where(created_at: format_time_range)
    end

    def apply_task_status_filter(filtered_task)
      filtered_task.where(status: @search_task_status)
    end

    def apply_ca_status_filter(filtered_task)
      failed_tasks_ids_object = CaRetry.obtain_failed_tasks_ids_object

      case @search_ca_status
      when 'success'
        failed_task_ids = SignStage.where(status: [:processing_file, :processing_file_failed]).pluck(:sign_task_id).uniq
        failed_task_ids << failed_tasks_ids_object[:fail_retrying]
        failed_task_ids << failed_tasks_ids_object[:failed]
        filtered_task.where.not(id: failed_task_ids.flatten.uniq)
      when 'ca_fail_retrying'
        filtered_task.where(id: failed_tasks_ids_object[:fail_retrying])
      when 'failed'
        failed_task_ids = SignStage.where(status: :processing_file_failed).pluck(:sign_task_id).uniq
        failed_task_ids << failed_tasks_ids_object[:failed]
        filtered_task.where(id: failed_task_ids.flatten.uniq)
      end
    end
  end
end

