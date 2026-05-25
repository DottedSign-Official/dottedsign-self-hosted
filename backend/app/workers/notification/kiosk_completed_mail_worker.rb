module Notification
  class KioskCompletedMailWorker < GeneralWorker
    def perform(task_id)
      @task = SignTask.find_by(id: task_id)
      return if @task.nil? || !@task.need_inform?
      return unless @task.kiosk?
      obtain_signer_emails
      return if @signer_emails.blank?

      send_completed_mail
    end

    private

    def obtain_signer_emails
      @signer_emails = @task.dummy_stages.joins(:stage_setting)
                                  .where("dummy_stages.actor_info::jsonb? 'email'")
                                  .where(stage_setting: { informable: true })
                                  .map { |stage| stage.actor_info['email'] }.uniq
      @signer_emails -= [@task.owner.email]
    end

    def send_completed_mail
      sender_email = @task.owner.email
      sender_name = @task.owner.display_name
      task_file_name = @task.file_name
      task_download_link = @task.completed_file.download_link
      task_size = @task.completed_file.file_size
      completed_message = @task.task_setting&.completed_message
      message_viewable_emails = can_view_completed_message_emails

      @signer_emails.each do |signer_email|
        message = message_viewable_emails.include?(signer_email) ? completed_message : nil
        MailCenter.delay.raise_if_server_failed('kiosk_completed_notification', sender_email, sender_name, signer_email, task_file_name, task_size, task_download_link, message, @task.receiver_lang)
      end
    end

    def can_view_completed_message_emails
      emails = @task.dummy_stages.where("(custom_message_setting ->> 'completed_viewable')::boolean").map { |stage| stage.actor_info['email'] }.compact.uniq
      emails - [@task.owner.email]
    end
  end
end
