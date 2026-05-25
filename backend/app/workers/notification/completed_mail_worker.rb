module Notification
  class CompletedMailWorker < GeneralWorker
    def perform(source_id, source_type = 'SignTask')
      @source = source_type.constantize.find_by_id(source_id)
      return if @source.nil?
      return if @source.is_a?(SignTask) && @source.in_envelope?
      return unless @source.need_inform?

      @file_extension = @source.is_a?(Envelope) ? ".zip" : nil
      @source_download_link = @source.completed_file.download_link
      @source_size = @source.completed_file.file_size
      @owner = @source.owner

      mail_form_signers if @source.sign_type == 'form' # envelope do not have form? method
      mail_flow_members
      mail_cc_members if @source.need_cc?
    end

    private

    def mail_form_signers
      form_stages = @source.stages.with_form_signer.includes(:actor).select { |stage| stage.actor_info['email'].present? }
      form_stages.each do |stage|
        token = @source.completed_file.preview_code(stage, will_expired: false, default_member_email: stage.actor_info['email'])
        raise 'form signer not able to preview this file' if token.nil?
        member = stage.actor
        lang = @source.mail_lang_for(member, stage)
        access_info = @source.access_info(member)
        can_download_task = access_info[:download_task] == :accessible
        can_download_audit_trail = access_info[:download_audit_trail] == :accessible
        MailCenter.delay.raise_if_server_failed('completed_notification', stage.actor_display_email, stage.actor_display_name, @owner, @source.file_name, token, @source_download_link, @source.sign_and_send?, @source_size, can_download_task, can_download_audit_trail, nil, @file_extension, lang)
      end
    end

    def mail_flow_members
      flow_members = Member.where(email: @source.related_emails - Settings.system_members.values)
      complete_viewable_member_ids = can_view_completed_message_member_ids
      flow_members.each do |member|
        stage = @source.stages.find_by(actor_id: member.id)
        token = @source.completed_file.preview_code(stage, will_expired: false, default_member_email: member.email)
        raise 'stage signer not able to preview this file' if token.nil?
        lang = @source.mail_lang_for(member, stage)
        access_info = @source.access_info(member)
        can_download_task = access_info[:download_task] == :accessible
        can_download_audit_trail = access_info[:download_audit_trail] == :accessible
        completed_message = complete_viewable_member_ids.include?(member.id) ? @source.setting&.completed_message : nil
        MailCenter.delay.raise_if_server_failed('completed_notification', member.email, member.display_name, @owner, @source.file_name, token, @source_download_link, @source.sign_and_send?, @source_size, can_download_task, can_download_audit_trail, completed_message, @file_extension, lang)
      end
    end

    def mail_cc_members
      cc_map = format_cc_map
      MailCenter.delay.raise_if_server_failed('cc_completed_notification', cc_map, @source.related_mail_infos, @owner.email, @owner.display_name, @source.file_name, @source_download_link, @source_size, @file_extension, @source.receiver_lang)
    end

    def format_cc_map
      cc_members = Member.where(email: @source.cc_related_emails)
      cc_info_map = @source.setting.cc_info.map { |info| [info['email'], info['name'] || info['email']] }.to_h
      cc_members.map { |member| [member.email, member.name || cc_info_map[member.email]] }.to_h
    end

    def can_view_completed_message_member_ids
      member_ids = @source.stages.where("(custom_message_setting ->> 'completed_viewable')::boolean").pluck(:actor_id)
      member_ids - [@source.owner_id]
    end
  end
end
