class ApplicationMailer < ActionMailer::Base
  helper :mail

  default from: -> { show_display_name(default_from_mail) }, content_type: 'text/html'
  layout false

  LARGE_FILE_SIZE = 6 * 1024 * 1024

  def self.available_locales
    %w[en hant hans ja ko es]
  end

  private

  def show_display_name(from_email)
    Settings.mail.smtp_display_name.present? ? "#{Settings.mail.smtp_display_name} <#{from_email}>" : from_email
  end

  def default_from_mail
    smtp_default_sender = Settings.mail.smtp_default_sender
    return smtp_default_sender if smtp_default_sender.present?

    domain = Settings.mail.smtp_domain
    user_name = Settings.mail.smtp_user.split('@').first
    "#{user_name}@#{domain}"
  end

  def format_link(host, path, replace_ops = {})
    path %= replace_ops if replace_ops.present?
    "#{host}#{path}"
  end

  def add_template_track(template_name)
    track extra: { template_name: template_name }
  end
end
