class Base
  extend Sidekiq::Extensions::Klass
  include ActiveSupport::Rescuable

  class << self

    def raise_if_server_failed(server_method, *args)
      return unless settings_enable?
      Rails.logger.info("[#{Time.zone.now}] Send #{server_method} mail with args: #{args}")

      kwargs = {}
      if args.length == 1 && args[0].is_a?(Hash)
        kwargs = args[0].transform_keys(&:to_sym)
        args = []
      end

      result = send(server_method, *args, **kwargs)
      raise "#{self.class.name} #{server_method} failed: #{result['message']} (error_code #{result['error_code']})" if result['status'] / 100 == 5
      result
    rescue Settingslogic::MissingSetting
    end

    def raise_if_not_success(server_method, *args)
      return unless settings_enable?
      result = send(server_method, *args)
      raise "#{self.class.name} #{server_method} failed: #{result['message']} (error_code #{result['error_code']})" unless result['status'] == 200
      result
    rescue Settingslogic::MissingSetting
    end

    def external_call(server_method, *args)
      return unless settings_enable?
      send(server_method, *args)
    rescue Settingslogic::MissingSetting
    end

    def settings_enable?
      return false if self == MailCenter && !Settings.mail.enable
      return false if self == NotificationCenter && !Settings.notification.enable
      true
    end
  end

end
