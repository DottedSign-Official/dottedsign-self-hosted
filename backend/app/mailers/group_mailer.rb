class GroupMailer < ApplicationMailer

  def group_invite(mail_info)
    @group_info = mail_info
    mail(mail_info)
  end

  def group_cancel(mail_info)
    @group_info = mail_info
    mail(mail_info)
  end

end
