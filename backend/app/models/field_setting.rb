class FieldSetting < ApplicationRecord
  self.inheritance_column = :field_type

  belongs_to :source, polymorphic: true
  belongs_to :stage, polymorphic: true
  belongs_to :field_setting_group, optional: true

  after_initialize :initialize_options
  before_validation :transform_field_value, if: :field_value_changed?
  before_create :setup_options

  # check custom_id uniqueness in scope of source and allow blank value
  validates :custom_id, uniqueness: { scope: [:source_id, :source_type], allow_blank: true }

  DEFAULT_FIELD_CLASS = FieldSettings::Signature
  MAX_LENGTH = 200.freeze
  FONT_SIZE_RANGE = 8..34
  ALLOW_ALIGNMENT = ['left', 'center', 'right'].freeze

  class << self

    # built-in class method to bind subclass in STI before storing record
    def sti_name
      self.name.demodulize.downcase
    end

    # built-in class method to bind subclass in STI after finding record
    def find_sti_class(type_name)
      type_name = "FieldSettings::#{type_name.camelize}"
      super
    end

    def setup_from_field_info(field_info)
      field_setting = self.find_or_initialize_by(field_info.slice(:source_type, :source_id, :stage_type, :stage_id, :field_object_id, :field_setting_group_id))
      field_setting.assign_attributes(field_info.slice(:field_value, :custom_id, :options, :coord, :page))
      field_setting if field_setting.save
    end

    def setup_from_xfdf_info(source_info, xfdf_info)
      xfdf_info.map do |info|
        info = info.to_h.deep_symbolize_keys
        field_type = field_type_from_info(info)
        field_class = FieldSetting.find_sti_class(field_type)
        field_setting_group = FieldSettingGroup.find_by(source_info.merge({ field_group_object_id: info.delete(:field_group_object_id) }))
        option_permit_keys = field_class.default_options.keys.map(&:to_sym) || []
        option_permit_keys -= field_setting_group.full_options.keys.map(&:to_sym) if field_setting_group.present?
        info[:field_object_id] = info.delete(:object_id)
        info[:options] = info[:options]&.slice(*option_permit_keys)&.compact || {}
        info[:field_setting_group_id] = field_setting_group.id if field_setting_group.present?
        field_class.setup_from_field_info(source_info.merge(info))
      end
    end

    private

    def field_type_from_info(info)
      case info[:field_type]
      when 'signature', 'datefield', 'radio', 'systemtime', 'link', 'image'
        info[:field_type]
      when 'textfield'
        info[:is_date] ? 'datefield' : 'textfield'
      when 'checkbox'
        info[:style].to_i.zero? ? 'checkbox' : 'radio'
      end
    end

  end

  def display_info
    info = as_json(only: [:field_object_id, :field_type, :field_value, :coord, :page, :object_id, :custom_id, :options])
    info[:field_group_object_id] = field_setting_group&.field_group_object_id
    if field_type == 'signature' && options['photo']
      info[:photo_link] = (options['signature_type']&.camelize&.safe_constantize || Signature).find_by(id: field_value)&.photo_file&.download_link
    end
    info
  end

  def full_options
    self.class.default_options.merge(options)
  end

  def match_content?(content, **hsh)
    false
  end

  def match_read_only?(value)
    if field_setting_group.present?
      return true unless field_setting_group.options['read_only']
    else
      return true unless options['read_only']
    end
    options['default'].to_s == value.to_s # allow nil == ""
  end

  def match_alignment?(alignment)
    return true if alignment.blank?
    return options['alignment'] == alignment if options['alignment_fixed']
    true
  end

  def match_font_size?(font_size)
    return true if font_size.blank?
    return options['font_size'] == font_size.to_i if options['font_size_fixed']
    FONT_SIZE_RANGE.include?(font_size.to_i)
  end

  protected

  class << self
    def default_options
      Settings.default.field_options[sti_name] || {}
    end

    def field_value_from_node(field_node)
      field_node.at('value')&.content
    end
  end

  private

  def transform_field_value
  end

  def setup_options
    if field_setting_group.present?
      self.options = self.class.default_options.dup.except(*field_setting_group.full_options.keys).merge(self.options || {}).stringify_keys
    else
      self.options = self.class.default_options.dup.merge(options || {}).stringify_keys
      self.options['force'] = ActiveModel::Type::Boolean.new.cast(options['force'])
    end
  end

  def initialize_options
    return unless self.has_attribute?('options')
    if field_setting_group.present?
      self.options = self.class.default_options.except(*field_setting_group.full_options.keys).merge(self.options || {})
    else
      self.options = self.class.default_options.merge(self.options || {})
    end
  end

end
