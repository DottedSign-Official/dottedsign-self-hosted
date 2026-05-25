# frozen_string_literal: true
class MailCenter < Base
  REQUESTER = JsonRequester.new(Settings.mail.host)
  DEFAULT_RECEIVER_LANG = Settings.default.preference.receiver_lang || Settings.default.profile.language || 'en'

  class << self

    def confirmation_instruction(email, user_name, confirmation_token, lang = DEFAULT_RECEIVER_LANG)
      path = Settings.mail.path.confirmation_instruction
      params = {
        email: email,
        user_name: user_name,
        token: confirmation_token,
        mail_lang: lang
      }

      REQUESTER.http_send(:post, path, params)
    end

    def forget_password(email, reset_password_token, lang = DEFAULT_RECEIVER_LANG)
      path = Settings.mail.path.forget_password
      frontend_path = "/reset-password?token=%{token}".freeze
      reset_password_link = format_link(Settings.host, frontend_path, token: reset_password_token)
      params = {
        email: email,
        reset_password_link: reset_password_link,
        mail_lang: lang
      }
      REQUESTER.http_send(:post, path, params)
    end

    def welcome(email, user_name, lang = DEFAULT_RECEIVER_LANG)
      path = Settings.mail.path.welcome
      params = { email: email, user_name: user_name, lang: lang }

      REQUESTER.http_send(:post, path, params)
    end

    def processing_notification(email, user_name, owner, action, file_name, token, custom_message, deadline, signer_name, lang = DEFAULT_RECEIVER_LANG)
      path = Settings.mail.path.sign_request
      params = {
        email: email,
        user_name: user_name,
        sender_name: owner.display_name,
        sender_email: owner.email,
        stage_action: action,
        doc_name: file_name,
        file_link: "#{Settings.branch_deep_link.web}/#{lang}/task?code=#{token}",
        message: custom_message,
        signer_name: signer_name,
        mail_lang: lang,
        template_name: action,
      }
      params[:deadline] = "#{deadline.utc.strftime('%Y-%m-%d %H:%M:%S')} (UTC)" if deadline.present?
      REQUESTER.http_send(:post, path, params)
    end

    def completed_notification(email, user_name, owner, file_name, token, complete_file_link, is_sign_and_send, file_size, can_download_task, can_download_audit_trail, completed_message, file_extension, lang = DEFAULT_RECEIVER_LANG)
      path = Settings.mail.path.sign_complete
      params = {
        email: email,
        user_name: user_name,
        sender_name: owner.display_name,
        sender_email: owner.email,
        doc_name: file_name,
        total_size: file_size,
        doc_download_link: complete_file_link,
        file_link: "#{Settings.branch_deep_link.web}/#{lang}/task?code=#{token}",
        template_name: is_sign_and_send ? 'sign_and_send_complete' : 'create_and_invite_complete',
        can_download_task: can_download_task,
        can_download_audit_trail: can_download_audit_trail,
        completed_message: completed_message,
        file_extension: file_extension,
        mail_lang: lang
      }

      REQUESTER.http_send(:post, path, params)
    end

    def kiosk_completed_notification(sender_email, sender_name, signer_email, file_name, file_size, completed_file_link, completed_message, lang = DEFAULT_RECEIVER_LANG)
      path = Settings.mail.path.kiosk_complete

      params = {
        sender_email: sender_email,
        sender_name: sender_name,
        email: signer_email,
        doc_name: "#{file_name}.pdf",
        total_size: file_size,
        doc_download_link: completed_file_link,
        message: completed_message,
        mail_lang: lang
      }

      REQUESTER.http_send(:post, path, params)
    end

    def modify_notification(email, user_name, reviewer, file_name, token, message, lang = DEFAULT_RECEIVER_LANG)
      path = Settings.mail.path.sign_modify
      params = {
        email: email,
        user_name: user_name,
        sender_email: reviewer.email,
        sender_name: reviewer.display_name,
        doc_name: file_name,
        file_link: "#{Settings.branch_deep_link.web}/#{lang}/task?code=#{token}",
        message: message,
        mail_lang: lang
      }
      REQUESTER.http_send(:post, path, params)
    end

    def confirm_notification(email, user_name, file_name, token, lang = DEFAULT_RECEIVER_LANG)
      path = Settings.mail.path.sign_confirm
      params = {
        email: email,
        user_name: user_name,
        doc_name: file_name,
        file_link: "#{Settings.branch_deep_link.web}/#{lang}/task?code=#{token}",
        mail_lang: lang
      }
      REQUESTER.http_send(:post, path, params)
    end

    def pass_notification(email, user_name, file_name, lang = DEFAULT_RECEIVER_LANG)
      path = Settings.mail.path.sign_pass
      params = {
        email: email,
        user_name: user_name,
        doc_name: file_name,
        mail_lang: lang
      }
      REQUESTER.http_send(:post, path, params)
    end

    def document_backup(email, user_name, file_name, token, doc_download_link, file_size, lang = DEFAULT_RECEIVER_LANG)
      path = Settings.mail.path.document_backup
      params = {
        email: email,
        user_name: user_name,
        doc_name: "#{file_name}.pdf",
        total_size: file_size,
        file_link: "#{Settings.branch_deep_link.web}/#{lang}/task?code=#{token}",
        doc_download_link: doc_download_link,
        mail_lang: lang
      }

      REQUESTER.http_send(:post, path, params)
    end

    def forget_remind(email, user_name, owner, file_name, token, pass_days, lang = DEFAULT_RECEIVER_LANG)
      path = Settings.mail.path.forget_remind
      params = {
        email: email,
        user_name: user_name,
        sender_name: owner.display_name,
        sender_email: owner.email,
        doc_name: file_name,
        file_link: "#{Settings.branch_deep_link.web}/#{lang}/task?code=#{token}",
        pass_days: pass_days,
        mail_lang: lang
      }

      REQUESTER.http_send(:post, path, params)
    end

    def expire_remind(email, user_name, owner, file_name, token, deadline, lang = DEFAULT_RECEIVER_LANG)
      path = Settings.mail.path.expire_remind
      params = {
        email: email,
        user_name: user_name,
        sender_name: owner.display_name,
        sender_email: owner.email,
        doc_name: file_name,
        file_link: "#{Settings.branch_deep_link.web}/#{lang}/task?code=#{token}",
        deadline: deadline,
        mail_lang: lang
      }

      REQUESTER.http_send(:post, path, params)
    end

    def signer_verify(email, verify_info, lang = DEFAULT_RECEIVER_LANG)
      path = Settings.mail.path.signer_verify
      params = verify_info.merge(email: email, mail_lang: lang)

      REQUESTER.http_send(:post, path, params)
    end

    def verify_method_changed(email, user_name, change_time, change_fields, lang = DEFAULT_RECEIVER_LANG)
      path = Settings.mail.path.verify_method_changed
      params = {
        email: email,
        user_name: user_name,
        change_time: change_time,
        mail_lang: lang
      }.merge(change_fields)

      REQUESTER.http_send(:post, path, params)
    end

    def forward_request(email, user_name, sender_name, sender_email, doc_name, token, request_info, lang = DEFAULT_RECEIVER_LANG)
      path = Settings.mail.path.forward_request
      params = {
        email: email,
        user_name: user_name,
        sender_name: sender_name,
        sender_email: sender_email,
        doc_name: doc_name,
        file_link: "#{Settings.branch_deep_link.web}/#{lang}/task?code=#{token}",
        new_signer: request_info[:new_signer],
        message: request_info[:message],
        mail_lang: lang
      }

      REQUESTER.http_send(:post, path, params)
    end

    def task_update(email, user_name, doc_name, token, old_receive_name, old_receive_email, new_receiver_name, new_receiver_email, execute_by, forward_reason, lang = DEFAULT_RECEIVER_LANG)
      path = Settings.mail.path.task_update
      params = {
        email: email,
        user_name: user_name,
        doc_name: doc_name,
        file_link: "#{Settings.branch_deep_link.web}/#{lang}/task?code=#{token}",
        old_receiver_name: old_receive_name,
        old_receiver_email: old_receive_email,
        new_receiver_name: new_receiver_name,
        new_receiver_email: new_receiver_email,
        execute_by: execute_by,
        forward_reason: forward_reason,
        mail_lang: lang
      }

      REQUESTER.http_send(:post, path, params)
    end

    def task_disable(email, user_name, doc_name, sender_email, sender_name, new_receiver_name, new_receiver_email, execute_by, lang = DEFAULT_RECEIVER_LANG)
      path = Settings.mail.path.task_disable
      params = {
        email: email,
        user_name: user_name,
        doc_name: doc_name,
        sender_email: sender_email,
        sender_name: sender_name,
        new_receiver_name: new_receiver_name,
        new_receiver_email: new_receiver_email,
        execute_by: execute_by,
        mail_lang: lang
      }

      REQUESTER.http_send(:post, path, params)
    end

    def task_deleted_remind(email:, user_name:, task_name:, sender_email:, sender_name:, lang: DEFAULT_RECEIVER_LANG)
      path = Settings.mail.path.task_deleted_remind
      params = {
        email: email,
        user_name: user_name,
        task_name: task_name,
        sender_email: sender_email,
        sender_name: sender_name,
        mail_lang: lang
      }

      REQUESTER.http_send(:post, path, params)
    end

    def deadline_change(email, user_name, sender_email, sender_name, doc_name, preview_code, deadline, lang = DEFAULT_RECEIVER_LANG)
      path = Settings.mail.path.deadline_change
      params = {
        email: email,
        user_name: user_name,
        sender_email: sender_email,
        sender_name: sender_name,
        doc_name: doc_name,
        file_link: "#{Settings.branch_deep_link.web}/#{lang}/task?code=#{preview_code}",
        deadline: "#{deadline.utc.strftime('%Y-%m-%d %H:%M:%S')} (UTC)",
        mail_lang: lang
      }

      REQUESTER.http_send(:post, path, params)
    end

    def cc_start_notification(cc_info, actor_info, owner_email, owner_name, file_name, lang = DEFAULT_RECEIVER_LANG)
      path = Settings.mail.path.cc_start_notification
      params = {
        emails: cc_info.keys,
        actor_info: actor_info,
        sender_email: owner_email,
        sender_name: owner_name,
        doc_name: "#{file_name}.pdf",
        mail_lang: lang
      }

      REQUESTER.http_send(:post, path, params)
    end

    def cc_completed_notification(cc_info, actor_info, owner_email, owner_name, file_name, complete_file_link, file_size, file_extension, lang = DEFAULT_RECEIVER_LANG)
      path = Settings.mail.path.cc_completed_notification
      params = {
        emails: cc_info.keys,
        actor_info: actor_info,
        sender_email: owner_email,
        sender_name: owner_name,
        doc_name: file_name,
        doc_download_link: complete_file_link,
        total_size: file_size,
        file_extension: file_extension,
        mail_lang: lang
      }

      REQUESTER.http_send(:post, path, params)
    end

    def declined_notification(email, email_info, sender_email, sender_name, doc_name, decline_reason, decline_message, token, lang)
      path = Settings.mail.path.sign_decline
      params = {
        email: email,
        email_info: email_info,
        sender_email: sender_email,
        sender_name: sender_name,
        doc_name: doc_name,
        file_link: "#{Settings.branch_deep_link.web}/#{lang}/task?code=#{token}",
        decline_reason: decline_reason,
        decline_message: decline_message,
        mail_lang: lang
      }
      REQUESTER.http_send(:post, path, params)
    end

    def group_invite(email, invite_token, lang)
      path = Settings.mail.path.group_invite
      invite_path = "/groups/accept?invite_token=%{token}".freeze
      invite_link = format_link(Settings.host, invite_path, token: invite_token)
      params = {
        email: email,
        invite_link: invite_link,
        mail_lang: lang
      }
      REQUESTER.http_send(:post, path, params)
    end

    def group_cancel(sender_email, user_email, lang)
      path = Settings.mail.path.group_cancel
      params = { sender_email: sender_email, email: user_email, mail_lang: lang }
      REQUESTER.http_send(:post, path, params)
    end

    def system_ca_fail_notify(emails, sign_task_id, sign_stage_id, error_message, lang = DEFAULT_RECEIVER_LANG)
      path = Settings.mail.path.system_ca_fail_notify
      params = {
        emails: emails,
        sign_task_id: sign_task_id,
        sign_stage_id: sign_stage_id,
        error_message: error_message,
        mail_lang: lang
      }

      REQUESTER.http_send(:post, path, params)
    end

    def signer_ca_fail_notify(email, name, doc_name, code, deadline, lang = DEFAULT_RECEIVER_LANG)
      path = Settings.mail.path.signer_ca_fail_notify
      params = {
        email: email,
        name: name,
        doc_name: doc_name,
        file_link: "#{Settings.branch_deep_link.web}/#{lang}/task?code=#{code}",
        mail_lang: lang
      }
      params[:deadline] = "#{deadline.utc.strftime('%Y-%m-%d %H:%M:%S')} (UTC)" if deadline.present?
      REQUESTER.http_send(:post, path, params)
    end

    def public_form_compress_download(email, form_name, download_link, lang = DEFAULT_RECEIVER_LANG)
      path = Settings.mail.path.public_form_compress_download
      params = {
        email: email,
        form_name: form_name,
        download_link: download_link,
        mail_lang: lang
      }
      REQUESTER.http_send(:post, path, params)
    end

    def owner_changed_notification(email, user_name, doc_name, old_owner_name, new_owner_name, new_owner_email, lang = DEFAULT_RECEIVER_LANG)
      path = Settings.mail.path.owner_changed_notification
      params = {
        email: email,
        user_name: user_name,
        doc_name: doc_name,
        old_owner_name: old_owner_name,
        new_owner_name: new_owner_name,
        new_owner_email: new_owner_email,
        mail_lang: lang
      }

      REQUESTER.http_send(:post, path, params)
    end

    private

    def format_link(host, path, replace_ops = {})
      path %= replace_ops if replace_ops.present?
      "#{host}#{path}"
    end
  end

end
