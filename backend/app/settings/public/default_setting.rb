class Public::DefaultSetting < Settingslogic
  source "#{Rails.root}/config/settings/default_settings.yml"
  namespace Rails.env

  class << self

    def permission_keys
      permissions.admin.keys
    end

  end
end
