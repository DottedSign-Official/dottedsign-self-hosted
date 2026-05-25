class Settings < Settingslogic
  source "#{Rails.root}/config/settings/settings.yml"
  namespace Rails.env

  class << self

    def icon
      Public::IconSetting
    end

    def default
      Public::DefaultSetting
    end

    def mail
      Public::MailSetting
    end

    def notification
      Public::NotificationSetting
    end

    def callback
      Public::CallbackSetting
    end

    def sms
      Public::SmsSetting
    end

    def digital_signature
      Public::DigitalSignatureSetting
    end

    def admin_regex
      Regexp.new(super)
    end

    def working_dir_for(storable, create_dir: false)
      dir = "#{working_dir}/#{storable.class.name}_#{storable.id}_#{DateTime.now.strftime('%Q')}"
      FileUtils.mkdir_p(dir) if create_dir
      dir
    end

    def create_cache_working_dir
      dir = "#{working_dir}/cache/#{SecureRandom.uuid}"
      FileUtils.mkdir_p(dir)
      dir
    end

  end

end
