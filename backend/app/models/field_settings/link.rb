module FieldSettings
  class Link < FieldSetting

    ALLOW_ALIGNMENT = ['left'].freeze

    def validate_options(is_owner_stage: false, **hsh)
      errors.add(:options, 'invalid read_only') if options['read_only'] && (is_owner_stage || options['default'].blank?)
      errors.add(:options, 'invalid font_size') if options['font_size'] && FONT_SIZE_RANGE.exclude?(options['font_size'].to_i)
      errors.add(:options, 'invalid alignment') if options['alignment'] && ALLOW_ALIGNMENT.exclude?(options['alignment'])
      errors.add(:options, 'invalid length') if options['length'] && options['length'].to_i > MAX_LENGTH
      errors.add(:options, 'invalid default') if options['default'].present? && !(match_length?(options['default']) && match_validation?(options['default']))
      errors.add(:options, 'invalid placeholder length') if options['placeholder'] && options['placeholder'].length > MAX_LENGTH
    end
    
    def match_content?(content, **hsh)
      content ||= {}
      return false unless match_read_only?(content[:value])
      return options['force'] == false if content[:value].blank?
      match_alignment?(content.dig(:options, :alignment)) && match_font_size?(content.dig(:options, :font_size)) && match_length?(content[:value]) && match_validation?(content[:value])
    end

    def text_dimensions
      return nil if field_value.blank?
      return nil if options['font_size'].blank?

      font = Font.new(Settings.pdf_font.path)
      font_size = options['font_size'].to_i
      width = font.width_of(field_value, font_size)
      height = font_size
      [width, height]
    rescue
      return nil
    end

    protected

    def self.match_by_field_info?(field_info)
      field_info[:field_type] == 'link'
    end

    def self.match_by_field_node?(field_node)
      field_node.name == 'link'
    end

    def setup_options
      super
      self.options['read_only'] = ActiveModel::Type::Boolean.new.cast(options['read_only'])
      self.options['font_size_fixed'] = ActiveModel::Type::Boolean.new.cast(options['font_size_fixed'])
      
      # force left alignment
      self.options['alignment'] = 'left'
      self.options['alignment_fixed'] = true
    end

    private
    
    def match_length?(value)
      CGI.unescapeHTML(value).length <= (options['length'] || MAX_LENGTH)
    rescue TypeError
      false
    end

    def match_validation?(value)
      regexp_pattern = /\bhttps?:\/\/[^\s]+/
      Regexp.new(regexp_pattern).match?(value)
    end
  end
end