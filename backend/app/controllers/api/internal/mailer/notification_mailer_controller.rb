class Api::Internal::Mailer::NotificationMailerController < Api::Internal::MailController

  def public_form_compress_download; end

  private

  def mailer
    ApplicationMailer.const_get('NotificationMailer')
  end

  def classify_public_form_compress_download_params
    @require_attrs = [:email, :form_name, :download_link]
    @permit_attrs = @require_attrs
  end

end
   