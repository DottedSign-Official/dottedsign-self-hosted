module Api::V1::Envelopes::AttributeHelper

  def common_stage_permit_attrs
    [pdf_object_info: [], custom_message_setting: custom_message_setting_attrs, stage_setting: stage_setting_attrs]
  end

  def envelope_stage_permit_attrs
    common_stage_permit_attrs + [{ actor_info: {} }]
  end

  def task_stage_permit_attrs
    common_stage_permit_attrs + [:email, :name, xfdf_info: envelope_xfdf_permit_attrs, field_setting_groups: envelope_field_setting_group_permit_params, attachment_setting: envelope_attachment_permit_attrs, verify: verify_attrs]
  end

  def envelope_xfdf_permit_attrs
    xfdf_permit_attrs + [:envelope_file_id, :task_id]
  end

  def envelope_field_setting_group_permit_params
    field_setting_group_permit_attrs + [:envelope_file_id, :task_id]
  end

  def envelope_attachment_permit_attrs
    attachment_permit_attrs + [:envelope_file_id, :task_id]
  end

  def file_info_permit_attrs
    [:page_num, :file_size_text]
  end

end