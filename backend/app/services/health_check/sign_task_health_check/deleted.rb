class HealthCheck::SignTaskHealthCheck
  module Deleted

    protected

    def status_check
      @health_report[:status_check] = CHECK_PASS if @task.status == 'deleted'
      @health_report[:stage_status_check] = CHECK_SKIP
    end

  end
end
