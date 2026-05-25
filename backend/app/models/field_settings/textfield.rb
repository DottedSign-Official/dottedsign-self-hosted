module FieldSettings
  class Textfield < FieldSetting
    ALLOW_VALIDATION = ['email', 'numbers', 'letters', 'regex']
    ALLOW_CREDIT_CARD_LENGTH = [13, 15, 16]

    def validate_options
      errors.add(:options, 'invalid read_only') if options['read_only'] && options['default'].blank?
      errors.add(:options, 'invalid font_size') if options['font_size'] && FONT_SIZE_RANGE.exclude?(options['font_size'].to_i)
      errors.add(:options, 'invalid alignment') if options['alignment'] && ALLOW_ALIGNMENT.exclude?(options['alignment'])
      errors.add(:options, 'invalid validation') if options['validation'] && ALLOW_VALIDATION.exclude?(options['validation'])
      errors.add(:options, 'invalid validation_regex') if options['validation_regex'] && options['validation'] != 'regex'
      errors.add(:options, 'invalid length') if options['length'] && options['length'].to_i > MAX_LENGTH
      errors.add(:options, 'invalid default') if options['default'].present? && !(match_length?(options['default']) && match_validation?(options['default']))
      errors.add(:options, 'invalid placeholder length') if options['placeholder'] && options['placeholder'].length > MAX_LENGTH
    end

    def match_content?(content, **hsh)
      content ||= {}
      return false unless match_read_only?(content[:value])
      return options['force'] == false if content[:value].blank?
      match_length?(content[:value]) && match_validation?(content[:value])
    end

    protected

    def self.match_by_field_info?(field_info)
      field_info[:field_type] == 'textfield' && !field_info[:is_date]
    end

    def self.match_by_field_node?(field_node)
      field_node.name == 'textfield' && field_node.attribute('textfield-spe')&.content != 'textfield-date'
    end

    def setup_options
      super
      self.options['read_only'] = ActiveModel::Type::Boolean.new.cast(options['read_only'])
      self.options['is_multi_line'] = ActiveModel::Type::Boolean.new.cast(options['is_multi_line'])
      self.options['font_size_fixed'] = ActiveModel::Type::Boolean.new.cast(options['font_size_fixed'])
      self.options['alignment_fixed'] = ActiveModel::Type::Boolean.new.cast(options['alignment_fixed'])
    end

    private

    def match_length?(value)
      value.length <= (options['length'] || MAX_LENGTH)
    end

    def match_validation?(value)
      return true unless options['validation']
      case options['validation']
      when 'email'
        URI::MailTo::EMAIL_REGEXP.match?(value)
      when 'numbers'
        /^[0-9]+$/.match?(value)
      when 'letters'
        /^[A-Za-z]+$/.match?(value)
      when 'regex'
        options['validation_regex'].present? && Regexp.new(options['validation_regex']).match?(value)
      when 'credit_card'
        ALLOW_CREDIT_CARD_LENGTH.include?(value.gsub(/\D/, '').length)
      else
        false
      end
    end
  end
end
