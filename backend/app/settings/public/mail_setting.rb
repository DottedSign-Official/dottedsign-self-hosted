class Public::MailSetting < Settingslogic
  source "#{Rails.root}/config/settings/mail_setting.yml"
  namespace Rails.env
end
