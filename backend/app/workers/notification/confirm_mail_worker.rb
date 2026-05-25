module Notification
  class ConfirmMailWorker < GeneralWorker

    def perform(stage_id)
      stage = SignStage.find_by(id: stage_id)
      return if stage.nil?
      task = stage.sign_task
      lang = task.mail_lang_for(stage.actor, stage)

      if stage.skip_confirm?
        MailCenter.delay.raise_if_server_failed('pass_notification', stage.email, stage.actor_display_name, task.file_name, lang)
      else
        token = task.original_file.preview_code(stage, will_expired: true)
        MailCenter.delay.raise_if_server_failed('confirm_notification', stage.email, stage.actor_display_name, task.file_name, token, lang)
      end
    end
  end
end
