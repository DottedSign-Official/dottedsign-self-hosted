module FieldSettings
  class Image < FieldSetting

    def validate_options(**hsh)
      errors.add(:options, 'invalid default') if options['default'].present?
      errors.add(:options, 'invalid read_only') if options['read_only']
    end

    def match_content?(content, **hsh)
      true
    end

    protected

    def self.match_by_field_info?(field_info)
      field_info[:field_type] == 'image'
    end

    def self.match_by_field_node?(field_node)
      field_node.name == 'image'
    end

    def transform_field_value
      return unless field_value.to_i.zero?
      image = ::Image.setup(field_value)
      self.field_value = image&.id
    end
  end
end
