class FieldSettingGroup < ApplicationRecord
  self.inheritance_column = :field_group_type

  belongs_to :source, polymorphic: true
  belongs_to :stage, polymorphic: true
  has_many :field_settings

  scope :object_id_order, -> { order(:field_group_object_id) }

  class << self
    # built-in class method to bind subclass in STI before storing record
    def sti_name
      self.name.demodulize.downcase
    end

    # built-in class method to bind subclass in STI after finding record
    def find_sti_class(type_name)
      type_name = "FieldSettingGroups::#{type_name.camelize}"
      super
    end

    def setup_from_request(source_info, field_setting_group_attrs)
      return if field_setting_group_attrs.nil?
      field_setting_group_attrs.each do |field_setting_group_attr|
        concrete_field_group_class = FieldSettingGroup.find_sti_class(field_setting_group_attr[:field_group_type])
        option_permit_keys = concrete_field_group_class.default_options.keys.map(&:to_sym) || []
        field_setting_group_attr[:options] = field_setting_group_attr[:options]&.slice(*option_permit_keys)&.compact || {}
        field_setting_group = concrete_field_group_class.find_or_initialize_by(source_info.merge(field_setting_group_attr.slice(:field_group_object_id)))
        field_setting_group.assign_attributes(field_setting_group_attr.slice(:options))
        field_setting_group.save
      end
    end
  end

  def display_info
    info = as_json(only: [:field_group_object_id, :field_group_type])
    info[:options] = full_options
    info
  end

  def validate_options(**hsh)
  end

  def match_content?(field_sign_info_batch, **hsh)
    false
  end

  def full_options
    self.class.default_options.merge(options)
  end

  protected

  class << self
    def default_options
      Settings.default.field_group_options[sti_name] || {}
    end
  end
end
