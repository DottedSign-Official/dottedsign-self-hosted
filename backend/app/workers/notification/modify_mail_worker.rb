module Notification
  class ModifyMailWorker < GeneralWorker

    def perform(stage_id, reviewer_id, message=nil)
      stage = SignStage.find_by(id: stage_id)
      return if stage.nil?

      task = stage.sign_task
      return unless task.waiting?

      reviewer = Member.find_by_id(reviewer_id)
      return if reviewer.nil?

      lang = task.mail_lang_for(stage.actor, stage)
      token = task.original_file.preview_code(stage, will_expired: true)
      MailCenter.delay.raise_if_server_failed('modify_notification', stage.email, stage.actor_display_name, reviewer, task.file_name, token, message, lang)
    end
  end
end
