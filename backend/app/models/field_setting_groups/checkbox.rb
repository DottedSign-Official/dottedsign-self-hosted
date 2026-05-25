module FieldSettingGroups
  class Checkbox < FieldSettingGroup
    # prepared for conditional rules feature
    class << self
      def can_be_trigger?
        false
      end

      def can_be_conditional?
        false
      end
    end

    def validate_options(is_owner_stage: false, **hsh)
      default_selected_count = hsh[:field_setting_options].count { |options| ActiveModel::Type::Boolean.new.cast(options[:default]) }
      errors.add(:options, 'invalid read_only') if options['read_only'] && is_owner_stage
      errors.add(:options, 'invalid force') if options['force'] && options['read_only'] && default_selected_count == 0
    end

    def match_content?(field_sign_info_batch, **hsh)
      field_values = field_sign_info_batch.pluck(:value).map { |value| ActiveModel::Type::Boolean.new.cast(value) }
      return options['force'] == false if field_values.count(true) == 0
      true
    end
  end
end