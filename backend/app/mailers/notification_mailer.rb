class NotificationMailer < ApplicationMailer
  def public_form_compress_download(mail_info)
    @sign_info = mail_info
    mail(mail_info)
  end
end
