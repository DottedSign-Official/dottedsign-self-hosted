module Notification
  class TaskDeletedRemindMail < GeneralWorker
    def perform(task_type, task_id)
      raise ArgumentError, 'Invalid task type' unless ['SignTask', 'Envelope'].include?(task_type)

      @source = task_type.constantize.find_by_id(task_id)
      return unless @source.present?

      task_name = @source.task_name
      owner_info = @source.owner_info
      sender_email = owner_info[:email]
      sender_name = owner_info[:name]

      recipient_infos.each do |info|
        MailCenter.delay.raise_if_server_failed(
          'task_deleted_remind',
          email: info[:email],
          user_name: info[:name],
          lang: info[:lang],
          task_name: task_name,
          sender_email: sender_email,
          sender_name: sender_name
        )
      end
    end

    private

    def recipient_infos
      owner_info = NotificationHelper.from_members([@source.owner])
      stage_infos = NotificationHelper.from_stages(@source.stages_for_notification(relevant_stage_ids))
      cc_infos = NotificationHelper.from_members(@source.cc_members)

      (owner_info + stage_infos + cc_infos).compact.uniq { |info| info[:email] }
    end

    def relevant_stage_ids
      exclude_statuses = @source.has_order? ? %i[declined canceled initial] : %i[declined canceled]
      stages.where.not(status: exclude_statuses).pluck(:id)
    end

    def stages
      return @source.dummy_stages if @source.is_a?(Envelope)

      @source.sign_stages
    end
  end
end
