class SignMailer < ApplicationMailer
  def sign_request(mail_info)
    signer_condition = mail_info[:sender_name].present? ? 'with_signer_name' : 'without_signer_name'
    mail_info[:subject] = I18n.t("sign_mailer.sign_request.#{mail_info[:stage_action] || 'sign'}.subject.#{signer_condition}", **mail_info)
    @sign_info = mail_info
    mail(mail_info)
  end

  def sign_complete(mail_info)
    setup_mail_attachment(mail_info)
    if mail_info[:can_download_task] && mail_info[:can_download_audit_trail]
      @display_key = "both_downloadable.#{@file_is_large ? 'more_than_10_mb_html' : 'less_than_10_mb_html'}"
    elsif mail_info[:can_download_task]
      @display_key = "task_downloadable.#{@file_is_large ? 'more_than_10_mb_html' : 'less_than_10_mb_html'}"
    elsif mail_info[:can_download_audit_trail]
      @display_key = 'audit_downloadable_html'
    else
      @display_key = 'both_not_downloadable_html'
    end
    @sign_info = mail_info
    mail(mail_info)
  end

  def kiosk_complete(mail_info)
    setup_mail_attachment(mail_info)
    @display_key = "both_downloadable.#{@file_is_large ? 'more_than_10_mb_html' : 'less_than_10_mb_html'}"
    @sign_info = mail_info
    mail(mail_info)
  end

  def sign_decline(mail_info)
    @sign_info = mail_info
    mail(mail_info)
  end

  def sign_modify(mail_info)
    @sign_info = mail_info
    mail(mail_info)
  end

  def sign_confirm(mail_info)
    @sign_info = mail_info
    mail(mail_info)
  end

  def sign_pass(mail_info)
    @sign_info = mail_info
    mail(mail_info)
  end

  def forget_remind(mail_info)
    @sign_info = mail_info
    mail(mail_info)
  end

  def expire_remind(mail_info)
    @sign_info = mail_info
    mail(mail_info)
  end

  def signer_verify(mail_info)
    @sign_info = mail_info
    mail(mail_info)
  end

  def verify_method_changed(mail_info)
    @sign_info = mail_info
    mail(mail_info)
  end

  def forward_request(mail_info)
    mail_info[:new_signer][:doc_name] = mail_info[:doc_name] if mail_info[:new_signer].present?
    @sign_info = mail_info
    mail(mail_info)
  end

  def task_update(mail_info)
    mail_info[:subject] = I18n.t("sign_mailer.task_update.default.subject.#{mail_info[:execute_by]}_update", **mail_info)
    @sign_info = mail_info
    mail(mail_info)
  end

  def task_disable(mail_info)
    mail_info[:subject] = I18n.t("sign_mailer.task_disable.default.subject.#{mail_info[:execute_by]}_disable", **mail_info)
    @sign_info = mail_info
    mail(mail_info)
  end

  def deadline_change(mail_info)
    @sign_info = mail_info
    mail(mail_info)
  end

  def doc_backup(mail_info)
    setup_mail_attachment(mail_info)
    @sign_info = mail_info
    mail(mail_info)
  end


  def signer_ca_fail_notify(mail_info)
    @sign_info = mail_info
    mail(mail_info)
  end

  def cc_sign_start(mail_info)
    @sign_info = mail_info
    mail(mail_info)
  end

  def cc_sign_complete(mail_info)
    setup_mail_attachment(mail_info)
    @sign_info = mail_info
    mail(mail_info)
  end

  def owner_changed_notification(mail_info)
    @sign_info = mail_info
    mail(mail_info)
  end

  def task_deleted_remind(mail_info)
    mail_info[:subject] = I18n.t("sign_mailer.task_deleted_remind.default.subject", **mail_info)
    @sign_info = mail_info
    mail(mail_info)
  end

  private

  def setup_mail_attachment(sign_info)
    return if (@file_is_large = sign_info[:total_size].to_i > LARGE_FILE_SIZE)
    # if attachments's key has " quotemark, it causes mail garbled.
    file_name = generate_file_name(sign_info)
    attachments[file_name] = prepare_attachment(sign_info[:doc_download_link])
    if sign_info[:attachment_link].present?
      attachment_name = generate_file_name(sign_info, :attachment)
      attachments[attachment_name] = prepare_attachment(sign_info[:attachment_link])
    end
  end

  def prepare_attachment(doc_download_link)
    host, path = separate_link(doc_download_link)
    response = JsonRequester.new(host).http_send(:get, path)
    if response['status'] == 200
      {
        mime_type: response['content_type'],
        content: response['body']
      }
    else
      raise 'can not download doc from link'
    end
  end

  def separate_link(link)
    uri = URI(link)
    host = "#{uri.scheme}://#{uri.host}"
    path = uri.request_uri
    return host, path
  end

  def generate_file_name(sign_info, file_type = :completed_file)
    file_extension = sign_info[:file_extension] || ".pdf"
    @base_name ||= sign_info[:doc_name].include?('"') ? "completed_file" : sign_info[:doc_name]
    case file_type
    when :completed_file
      @base_name + file_extension
    when :attachment
      @base_name + "_attachment" + file_extension
    end
  end
end
