class HealthCheck::SignTaskHealthCheck
  module Waiting

    protected

    def check_items
      super + [
        :stage_attachment_file_check,
        :stage_file_check
      ]
    end

    def status_check
      @health_report[:status_check] = CHECK_PASS if @task.status == 'waiting' && !@task.stages.pluck(:status).all?('done')

      if @task.has_order
        allow_previous_stage_statuses_hash = {
          initial: [:initial, :processing],
          processing: [:done],
          done: [:done]
        }
        prev_stage = nil
        @task.stages.each_with_index do |stage, index|
          return if allow_previous_stage_statuses_hash.exclude?(stage.status.to_sym)
          return if index != 0 && allow_previous_stage_statuses_hash[stage.status.to_sym].exclude?(prev_stage.status.to_sym)
          return if stage.done?
          prev_stage = stage
        end
        @health_report[:stage_status_check] = CHECK_PASS
      else
        allow_statuses = [:processing, :done]
        @health_report[:stage_status_check] = CHECK_PASS if (@task.stages.pluck(:status).map(&:to_sym) - allow_statuses).empty?
      end
    end

    def external_file_check
      super
      done_stages = @task.stages.includes(:attachments, :stage_file).select { |stage| stage.status == 'done' }
      @health_report[:stage_attachment_file_check] = CHECK_PASS if done_stages.map(&:attachment_ready?).flatten.all?(true)
      @health_report[:stage_file_check] = CHECK_SKIP unless @task.create_and_invite?
      @health_report[:stage_file_check] = CHECK_PASS if done_stages.map(&:stage_file).map(&:present?).all?(true)
    end
  end
end
