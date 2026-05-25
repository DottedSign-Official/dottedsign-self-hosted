class Public::SmsSetting < Settingslogic
  source "#{Rails.root}/config/settings/sms_setting.yml"
  namespace Rails.env
end
