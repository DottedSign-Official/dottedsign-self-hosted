class Public::NotificationSetting < Settingslogic
  source "#{Rails.root}/config/settings/notification_setting.yml"
  namespace Rails.env
end
