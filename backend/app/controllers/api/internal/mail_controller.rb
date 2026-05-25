class Api::Internal::MailController < Api::ApplicationController
  include MailHelper

  skip_before_action :setup_current_member
  before_action :check_recipients!
  before_action :classify_params
  before_action :start_sending_mail

  rescue_from ActionView::MissingTemplate do |exception|
    error_response(400, "#{exception.class.name}: #{exception.message}")
  end

  private

  def check_recipients!
    return error_response(500, "#{self.class.name} controller is not existed") if mailer.nil?
    params[:emails] ||= [params[:email]].compact
    error_response(:no_available_email) if params[:emails].blank?
  end

  def mailer; end

  def queue_level
    :low
  end

  def mail_params
    template_name = params[:template_name] || "default"
    mail_lang_mapping = LangHandle.mail_lang_mapping(params[:mail_lang])
    if I18n.exists?("#{controller_name}.#{action_name}.#{template_name}", mail_lang_mapping)
      params[:mail_lang] = mail_lang_mapping
      I18n.locale = mail_lang_mapping
    else
      I18n.locale = 'en'
    end
    subject = I18n.t('subject', scope: [controller_name, action_name, template_name], **params.to_enum.to_h.symbolize_keys)
    params[:to] = params[:email] || params[:emails]&.join(',')
    params[:subject] = subject
    params[:template_path] = "#{controller_name}/#{action_name}"
    params[:template_name] = template_name
    @permit_attrs += [:mail_lang, :to, :subject, :template_path, :template_name]
    params.permit(*@permit_attrs)
  end

  def start_sending_mail
    mail_info = mail_params.to_h.deep_symbolize_keys
    send_failed = {}

    begin
      result = mailer.send(action_name, mail_info).deliver_later(queue: queue_level)
      send_failed[recipient.email] = { status: 400, message: 'sender not exist' } if result.nil?
    rescue Net::SMTPAuthenticationError => smtp_err
      send_failed[recipient.email] = { status: 401, message: "smtp auth error: #{smtp_err.message}" }
    rescue Exception => e
      send_failed[recipient.email] = { status: 500, message: "smtp error: #{e.message} (#{e.backtrace.first})" }
    end
    return error_response(406, 'some mail send failed', send_failed) if send_failed.present?
    success_response('start sending mail')
  end

  def classify_params
    send("classify_#{action_name}_params") if self.class.private_method_defined?("classify_#{action_name}_params")
    @permit_attrs ||= params.keys
    params.require(@require_attrs || :emails)
  end
end
