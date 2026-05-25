class HealthCheck::SignTaskHealthCheck
  module Completed

    protected

    def check_items
      super + [
        :completed_file_check,
        :audit_trail_file_check
      ]
    end

    def status_check
      @health_report[:status_check] = CHECK_PASS if @task.status == 'completed'
      @health_report[:stage_status_check] = CHECK_PASS if @task.stages.pluck(:status).all?('done')
    end

    def external_file_check
      super
      @health_report[:completed_file_check] = CHECK_PASS if @task.completed_file.present?
      @health_report[:audit_trail_file_check] = CHECK_PASS if @task.audit_trail_file.present?
    end

  end
end
