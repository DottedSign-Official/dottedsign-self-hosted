class Api::Internal::Mailer::GroupMailerController < Api::Internal::MailController

  def group_invite; end

  def group_cancel; end

  private

  def mailer
    ApplicationMailer.const_get('GroupMailer')
  end

  def classify_group_invite_params
    @require_attrs = [:email]
    @permit_attrs = @require_attrs + [:invite_link]
  end

  def classify_group_cancel_params
    @require_attrs = [:sender_email, :email]
    @permit_attrs = @require_attrs
  end

end
