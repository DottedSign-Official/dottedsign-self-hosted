class SignTask
  module Remindable
    extend ActiveSupport::Concern

    include TaskRelated::Remindable

    def expire_remindable?
      return false unless waiting?
      task_setting.deadline.present? && task_setting.expire_remind_at.present?
    end

    def remind_now
      return unless waiting?
      return if is_dummy?
      processing_stages.map do |stage|
        Notification::SignRemindWorker.perform_async(:forget_remind, stage.id)
        stage.email
      end
    end

  end
end
