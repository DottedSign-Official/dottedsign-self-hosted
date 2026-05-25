module Notification
  class ProcessingMailWorker < GeneralWorker
    def perform(stage_id, stage_type = 'SignStage')
      stage = stage_type.constantize.find_by(id: stage_id)
      return if stage.nil?

      source = stage.source
      actor = stage.actor
      base_stage = stage.action_review? ? stage.base_stage : nil
      lang = source.mail_lang_for(actor, stage)
      preview_code = source.original_file.preview_code(stage, will_expired: true)
      raise 'stage signer not able to preview this file' if preview_code.nil?

      setting = source.setting
      custom_message = actor_can_view_custom_message?(stage) ? setting&.message : nil
      MailCenter.delay.raise_if_server_failed('processing_notification', stage.email, stage.actor.display_name, source.owner, stage.action, source.file_name, preview_code, custom_message, setting&.deadline, base_stage&.actor_display_name, lang)
    end

    private

    def actor_can_view_custom_message?(stage)
      return false if stage.actor_id == stage.source.owner_id

      stage.custom_message_setting['processing_viewable']
    end
  end
end
