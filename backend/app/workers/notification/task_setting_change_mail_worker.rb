module Notification
  class TaskSettingChangeMailWorker < GeneralWorker

    def perform(source_id, source_type, change_type, change_value)
      @source = source_type.constantize.find_by_id(source_id)
      return if @source.nil?

      case change_type
      when 'deadline'
        deadline_change_notify(change_value)
      end
    end

    private

    def deadline_change_notify(deadline)
      deadline = Time.at(deadline)
      owner_email = @source.owner.email
      owner_name = @source.owner.display_name
      @source.stages.processing.includes(:actor).each do |stage|
        preview_code = @source.original_file.preview_code(stage, will_expired: true)
        lang = @source.mail_lang_for(stage.actor, stage)
        MailCenter.external_call('deadline_change', stage.email, stage.actor_display_name, owner_email, owner_name, @source.file_name, preview_code, deadline, lang)
      end
    end
  end
end
