class HealthCheck::SignTaskHealthCheck
  module Draft

    protected

    def check_items
      super + [
        :status_check,
        :stage_status_check,
        :original_file_check,
        :original_file_thumbnail_check,
        :full_file_check,
        :reference_file_check,
        :completed_reference_file_check
      ]
    end

    def status_check
      @health_report[:status_check] = CHECK_PASS if @task.status == 'draft'
      @health_report[:stage_status_check] = CHECK_PASS if @task.stages.pluck(:status).all?('initial')
    end

    def external_file_check
      @health_report[:original_file_check] = CHECK_PASS if @task.original_file.present?
      @health_report[:original_file_thumbnail_check] = CHECK_PASS if @task.original_file&.thumbnail['cover_50'].present?
      @health_report[:full_file_check] = CHECK_PASS if @task.full_file.present?
      @health_report[:reference_file_check] = CHECK_PASS if @task.references_ready?
      @health_report[:completed_reference_file_check] = CHECK_PASS if @task.completed_reference_ready?
    end

  end
end
