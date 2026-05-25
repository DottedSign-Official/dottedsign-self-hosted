class MemberMailer < ApplicationMailer
  def confirmation_instruction(mail_info)
    path = "/verification?token=%{token}".freeze
    confirmation_link = format_link(Settings.host, path, token: mail_info[:token])
    mail_info[:confirmation_link] = confirmation_link
    mail_info[:confirmation_button_link] = confirmation_link + "&subscribe=true"
    @member_info = mail_info
    mail(mail_info)
  end

  def first_time_welcome(mail_info)
    @member_info = mail_info
    mail(mail_info)
  end

  def forget_password(mail_info)
    @member_info = mail_info
    mail(mail_info)
  end

end
