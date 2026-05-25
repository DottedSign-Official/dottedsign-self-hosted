module FieldSettings
  class Systemtime < FieldSetting
    AVAILABLE_FORMAT_SETTINGS = %w[year_roc year_ad month day].freeze

    def validate_options
      errors.add(:options, 'invalid format') if AVAILABLE_FORMAT_SETTINGS.exclude?(options['format'])
    end

    def match_content?(content, **hsh)
      true
    end
  end
end
