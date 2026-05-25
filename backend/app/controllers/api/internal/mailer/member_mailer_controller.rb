class Api::Internal::Mailer::MemberMailerController < Api::Internal::MailController

  def confirmation_instruction; end

  def first_time_welcome; end

  def forget_password; end

  private

  def mailer
    ApplicationMailer.const_get('MemberMailer')
  end

  def classify_confirmation_instruction_params
    @require_attrs = [:email, :token]
    @permit_attrs = @require_attrs + [:confirm_link, :user_name]
  end

  def classify_first_time_welcome_params
    @require_attrs = [:email]
    @permit_attrs = @require_attrs+ [:user_name]
  end

  def classify_forget_password_params
    @require_attrs = [:email, :reset_password_link]
    @permit_attrs = @require_attrs
  end

end
