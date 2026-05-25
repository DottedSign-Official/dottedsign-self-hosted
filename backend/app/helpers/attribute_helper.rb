module AttributeHelper

  def xfdf_permit_attrs
    [:field_type, :object_id, :field_group_object_id, :custom_id, :page, :width, :border_color, :background_color, :is_date, :style, coord: [], options: field_options_permit_attrs]
  end

  def sign_permit_attrs
    [:object_id, :type, :value, :style, :font_size, :alignment, :date_format, :zone, :changed]
  end

  def field_options_permit_attrs
    Settings.default.field_options.values.map(&:keys).flatten.uniq.map(&:to_sym)
  end

  def field_setting_group_permit_attrs
    [:field_group_type, :field_group_object_id, options: field_group_options_permit_attrs]
  end

  def field_group_options_permit_attrs
    Settings.default.field_group_options.values.map(&:keys).flatten.uniq.map(&:to_sym) - [:min_quantity, :max_quantity]
  end

  def custom_message_setting_attrs
    [:processing_viewable, :completed_viewable]
  end

  def attachment_permit_attrs
    [:attachment_id, :file_name, :force, :viewable_in_processing]
  end

  def reference_attrs
    [:file_name, :reference_type, :reference_id]
  end

  def stage_setting_attrs
    [:forward_enable, :decline_enable, :viewable_in_processing, :viewable_in_completed, :reviewed_skip_confirm, viewable_in_processing_attachments: []]
  end

  def verify_attrs
    [:verify_type, :verify_source, :sequence, :occassion]
  end

  def verify_info_permit_attrs
    [:uuid, :verify_data, :identity_verify_token]
  end

end
