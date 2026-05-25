module Notification
  class SignRemindWorker < GeneralWorker

    def perform(remind_type, stage_id, remind_info = {})
      @stage = SignStage.find_by_id(stage_id)
      return if @stage.nil?
      setup_mail_content_info
      send(remind_type, remind_info)
    end

    private

    def setup_mail_content_info
      if @stage.sign_task.in_envelope?
        @source = @stage.sign_task.envelope
        preview_stage = StageFinder.find_by_sequence(@source.dummy_stages, @stage.sequence)
      else
        @source = @stage.sign_task
        preview_stage = @stage
      end
      @preview_code = @source.original_file.preview_code(preview_stage, will_expired: true)
      @lang = @source.mail_lang_for(@stage.actor, @stage)
      raise 'stage signer not able to preview this file' if @preview_code.nil?
    end

    def forget_remind(remind_info)
      pass_days = remind_info['pass_days'] || (Time.zone.now - @stage.processing_from).to_i / ActiveSupport::Duration::SECONDS_PER_DAY
      MailCenter.delay.raise_if_server_failed('forget_remind', @stage.email, @stage.actor_display_name, @source.owner, @source.file_name, @preview_code, pass_days, @lang)
    end

    def expire_remind(remind_info)
      deadline = Time.at(remind_info['deadline']).strftime('%Y-%m-%d (%Z)')
      MailCenter.delay.raise_if_server_failed('expire_remind', @stage.email, @stage.actor_display_name, @source.owner, @source.file_name, @preview_code, deadline, @lang)
    end

    def signer_ca_fail_notify_remind(remind_info)
      deadline = Time.at(remind_info['deadline']).strftime('%Y-%m-%d (%Z)') if remind_info['deadline'].present?
      MailCenter.delay.raise_if_server_failed('signer_ca_fail_notify', @stage.email, @stage.actor_display_name, @source.file_name, @preview_code, deadline, @lang)
    end
  end
end
