class HealthCheck::SignTaskHealthCheck
  module Expired

    protected

    def status_check
      @health_report[:status_check] = CHECK_PASS if @task.status == 'expired'
      @health_report[:stage_status_check] = CHECK_SKIP
    end

  end
end
