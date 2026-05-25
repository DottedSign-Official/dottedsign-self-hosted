class SystemMailer < ApplicationMailer

  def system_ca_fail_notify(mail_info)
    @mail_info = mail_info
    mail(mail_info)
  end

end
