module FieldSettings
  class Radio < FieldSetting

    def validate_options
      errors.add(:options, 'invalid default if read_only') if options['force'] && options['read_only'] && options['default'] == false
    end

    def match_content?(content, **hsh)
      content ||= {}
      return false unless match_read_only?(content[:value])
      return options['force'] == false if field_setting_group.nil? && content[:value].blank?
      true
    end

    def enterprise_display_info
      {
        field_type: 'checkbox',
        style: 1
      }
    end

    protected

    def self.match_by_field_info?(field_info)
      field_info[:field_type] == 'radio' || (field_info[:field_type] == 'checkbox' && field_info[:style] == 1)
    end

    def self.match_by_field_node?(field_node)
      field_node.name == 'radio' || (field_node.name == 'checkbox' && field_node.attribute('style').content == '1')
    end

    def transform_field_value
      return if field_value.nil?
      field_value.downcase! if field_value.is_a?(String) # do not write field_value = field_value.downcase, it will make field_value become nil
      self.field_value = ActiveModel::Type::Boolean.new.cast(field_value)
    end

    def setup_options
      super
      self.options['force'] = ActiveModel::Type::Boolean.new.cast(options['force']) if field_setting_group.nil?
      self.options['default'] = ActiveModel::Type::Boolean.new.cast(options['default'])
    end
  end
end
