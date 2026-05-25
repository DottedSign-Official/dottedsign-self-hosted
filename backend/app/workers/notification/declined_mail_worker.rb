module Notification
  class DeclinedMailWorker < GeneralWorker
    def perform(source_id, source_type = 'SignTask')
      @source = source_type.constantize.find_by_id(source_id)
      return if @source.nil?

      setup_decline_log
      setup_members
      setup_mail_info

      mail_owner
      mail_designated_members
      mail_other_related_members
    end

    private

    def setup_decline_log
      @decline_log = @source.decline_log
      source_name = @source.is_a?(Envelope) ? 'envelope' : 'task'
      raise "#{source_name} is not declined" if @decline_log.nil?
      @decliner = @decline_log.sign_stage.actor
      @decliner_name = @decliner.display_name
    end

    def setup_members
      related_emails = @source.related_emails + @source.cc_related_emails
      notifiable_emails = (@source.has_order? ? @source.finished_member_emails : @source.related_emails) + @source.cc_related_emails
      designated_emails = (@decline_log[:reply_to] & related_emails)

      @owner = @source.owner
      @designated_members = Member.where(email: designated_emails) - [@source.owner, @decliner]
      @other_related_members = Member.where(email: (notifiable_emails - designated_emails)) - [@source.owner, @decliner]
    end

    def setup_mail_info
      @doc_name = @source.file_name
    end

    def mail_owner
      owner_hash = [[@owner.email, @owner.display_name]].to_h
      lang = @source.mail_lang_for(@owner)
      token = @source.original_file.preview_code(will_expired: true, default_member_email: @owner.email)
      MailCenter.delay.raise_if_server_failed('declined_notification', @owner.email, owner_hash, @decliner.email, @decliner_name, @doc_name, @decline_log[:reason], @decline_log[:message], token, lang)
    end

    def mail_designated_members
      designated_member_hash = @designated_members.map do |member|
        [member.email, member.display_name]
      end.to_h
      return unless designated_member_hash.present?
      @designated_members.each do |member|
        token = @source.original_file.preview_code(will_expired: true, default_member_email: member.email)
        lang = @source.mail_lang_for(member)
        MailCenter.delay.raise_if_server_failed('declined_notification', member.email, designated_member_hash, @decliner.email, @decliner_name, @doc_name, @decline_log[:reason], @decline_log[:message], token, lang)
      end
    end

    def mail_other_related_members
      other_related_member_hash = @other_related_members.map do |member|
        [member.email, member.display_name]
      end.to_h
      return unless other_related_member_hash.present?
      @other_related_members.each do |member|
        lang = @source.mail_lang_for(member)
        token = @source.original_file.preview_code(will_expired: true, default_member_email: member.email)
        MailCenter.delay.raise_if_server_failed('declined_notification', member.email, other_related_member_hash, @decliner.email, @decliner_name, @doc_name, @decline_log[:reason], @decline_log[:message], token, lang)
      end
    end
  end
end
