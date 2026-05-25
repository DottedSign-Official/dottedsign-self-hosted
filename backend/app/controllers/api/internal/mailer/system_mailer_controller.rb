class Api::Internal::Mailer::SystemMailerController < Api::Internal::MailController

  def system_ca_fail_notify; end

  private

  def mailer
    ApplicationMailer.const_get('SystemMailer')
  end

  def classify_system_ca_fail_notify_params
    @require_attrs = [:emails, :sign_task_id]
    @permit_attrs = @require_attrs + [:sign_stage_id, :error_message]
  end

end
