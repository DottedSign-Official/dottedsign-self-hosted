class HealthCheck::SignTaskHealthCheck
  module Declined

    protected

    def status_check
      @health_report[:status_check] = CHECK_PASS if @task.status == 'declined'
      @health_report[:stage_status_check] = CHECK_PASS if @task.stages.pluck(:status).all?('done')

      if @task.has_order
        allow_previous_stage_statuses_hash = {
          done: [:done],
          declined: [:done],
          canceled: [:declined, :canceled],
        }
        prev_stage = nil
        @task.stages.each_with_index do |stage, index|
          return if allow_previous_stage_statuses_hash.exclude?(stage.status.to_sym)
          return if index != 0 && allow_previous_stage_statuses_hash[stage.status.to_sym].exclude?(prev_stage.status.to_sym)
          prev_stage = stage
        end
        @health_report[:stage_status_check] = CHECK_PASS
      else
        allow_statuses = [:done, :declined, :canceled]
        @health_report[:stage_status_check] = CHECK_PASS if @task.stages.pluck(:status).map(&:to_sym) - allow_statuses == []
      end

    end

  end
end
