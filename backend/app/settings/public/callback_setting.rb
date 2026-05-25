class Public::CallbackSetting < Settingslogic
  source "#{Rails.root}/config/settings/callback_setting.yml"
  namespace Rails.env

  class << self
    def event_for(source_type, status)
      # SignTask -> task
      # Envelope -> envelope
      # DummyStage -> stage, SignStage -> stage
      converted_source_type = source_type.underscore.split('_').last
      event_name = "#{converted_source_type}_#{status}"
      events.send(event_name).present? ? event_name : nil
    end

    def enable_for(event_name)
      events.send(event_name).enable
    end

    def event_path_for(event_name)
      events.send(event_name).path
    end
  end
end
