module FieldSettings
  class Datefield < FieldSetting

    AVAILABLE_DATE_SETTINGS = %w[current_only future_enable past_enable no_limit].freeze

    def validate_options
      errors.add(:options, 'invalid read_only') if options['read_only'] && options['default'].blank?
      errors.add(:options, 'invalid font_size') if options['font_size'] && FONT_SIZE_RANGE.exclude?(options['font_size'].to_i)
      errors.add(:options, 'invalid alignment') if options['alignment'] && ALLOW_ALIGNMENT.exclude?(options['alignment'])
      errors.add(:options, 'invalid date_setting') if options['date_setting'] && AVAILABLE_DATE_SETTINGS.exclude?(options['date_setting'])
      errors.add(:options, 'date_setting should be no_limit if default given') if options['default'].present? && options['date_setting'] != 'no_limit'
      errors.add(:options, 'invalid default') if options['default'].present? && options['date_format'] && !match_date_format?(options['date_format'], options['zone'].to_i, options['default'])
      errors.add(:options, 'invalid placeholder length') if options['placeholder'] && options['placeholder'].length > MAX_LENGTH
    end

    def match_content?(content, skip_date_check: false, **hsh)
      content ||= {}
      return false unless match_read_only?(content[:value])
      return options['force'] == false if content[:value].blank?
      return true if skip_date_check
      match_date_format?(content[:date_format], content[:zone], content[:value]) && match_date_value?(content[:date_format], content[:zone], content[:value])
    end

    def enterprise_display_info
      {
        field_type: 'textfield',
        is_date: true
      }
    end

    protected

    def self.match_by_field_info?(field_info)
      field_info[:field_type] == 'textfield' && field_info[:is_date]
    end

    def self.match_by_field_node?(field_node)
      field_node.name == 'textfield' && field_node.attribute('textfield-spe')&.content == 'textfield-date'
    end

    def setup_options
      super
      self.options['read_only'] = ActiveModel::Type::Boolean.new.cast(options['read_only'])
    end

    private

    def match_date_format?(date_format, zone, value)
      return true unless options['date_format'].present?
      options['date_format'] == date_format && parse_date(date_format, zone, value).present?
    end

    def match_date_value?(date_format, zone, value)
      time_zone = TimezoneMapping[:hour_zone][zone.to_f]
      zone_offset = TimezoneMapping[:zone_hour][time_zone]
      date_value = parse_date(date_format, zone, value)&.strftime('%Y%m%d')
      current_value = DateTime.now.in_time_zone(time_zone).strftime('%Y%m%d')
      return false if date_value.nil?

      case options['date_setting']
      when 'current_only'
        current_value == date_value
      when 'future_enable'
        current_value <= date_value
      when 'past_enable'
        current_value >= date_value
      when 'no_limit'
        true
      end
    end

    def parse_date(date_format, zone, value)
      # return instance of ActiveSupport::TimeWithZone
      time_zone = TimezoneMapping[:hour_zone][zone.to_f]
      zone_offset = TimezoneMapping[:zone_hour][time_zone]
      DateTime.strptime("#{value} #{zone_offset}", parse_date_format(date_format)).in_time_zone(time_zone)
    rescue Date::Error
      nil
    end

    def parse_date_format(date_format)
      date_format = date_format.sub('yyyy', '%Y').sub('mm', '%m').sub('dd', '%d').sub('HH', '%H').sub('MM', '%M').sub('SS', '%S')
      date_format += ' %Z'
    end
  end
end
