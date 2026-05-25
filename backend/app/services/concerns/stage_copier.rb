module StageCopier
  extend ActiveSupport::Concern

  def format_stage_attachment_settings(target_stage, source_attachment_settings)
    @attachment_id_map ||= {}
    source_attachment_settings.each_with_index do |setting, index|
      original_attachment_id = setting[:attachment_id]
      setting[:attachment_id] = "dummy_attachment_#{target_stage.id}_#{index + 1}"
      next unless setting[:viewable_in_processing]
      @attachment_id_map[original_attachment_id] = setting[:attachment_id]
    end
  end

  def create_stage_stage_setting(target_stage, stage_setting_attr = {})
    stage_setting = StageSetting.new(stage: target_stage)
    stage_setting.assign_attributes(Settings.default.stage_setting.symbolize_keys.merge(stage_setting_attr))
    stage_setting.viewable_in_processing_attachments.map! { |attachment_id| @attachment_id_map[attachment_id] }.compact!
    target_stage.stage_setting = stage_setting
  end

  def create_stage_field_setting_groups(target_stage, field_setting_group_attrs)
    field_setting_group_attrs.each do |field_setting_group_attr|
      concrete_field_group_class = FieldSettingGroup.find_sti_class(field_setting_group_attr[:field_group_type])
      option_permit_keys = concrete_field_group_class.default_options.keys.map(&:to_sym) || []
      field_setting_group_attr[:options] = field_setting_group_attr[:options]&.slice(*option_permit_keys)&.compact || {}
      field_setting_group = concrete_field_group_class.new({ source: @template, stage: target_stage }.merge(field_setting_group_attr))
      target_stage.field_setting_groups << field_setting_group
    end
  end

  def create_stage_field_settings(target_stage, field_setting_attrs)
    field_setting_attrs.each do |field_setting_attr|
      concrete_field_class = FieldSetting.find_sti_class(field_setting_attr[:field_type])
      field_setting_group = target_stage.field_setting_groups.find_by(field_group_object_id: field_setting_attr.delete(:field_group_object_id))
      option_permit_keys = concrete_field_class.default_options.keys.map(&:to_sym) || []
      option_permit_keys -= field_setting_group.full_options.keys.map(&:to_sym) if field_setting_group.present?
      field_setting_attr[:options] = field_setting_attr[:options]&.slice(*option_permit_keys) || {}
      field_setting = concrete_field_class.new({ source: @template, stage: target_stage, field_setting_group: field_setting_group }.merge(field_setting_attr))
      target_stage.field_settings << field_setting
    end
  end

  def create_stage_verify_methods(target_stage, verify_attrs)
    verify_attrs.each_with_index do |verify_attr, index|
      verify_attr[:sequence] ||= index + 1
      target_stage.verify_methods << VerifyMethod.new({ stage: target_stage }.merge(verify_attr))
    end
  end

  def create_stage_xfdf_document(target_stage, source_xfdf_document)
    target_stage.xfdf_document = XfdfDocument.new(source: @template, content: source_xfdf_document&.content)
  end

  def create_files(target_object, source_object, file_types = ['original', 'full'])
    source_object.service_files.uploaded.where(label: file_types).each do |source_file|
      source_file.copy_to(target_object, source_file.label, skip_callback: true)
    end
    @template.active!
  end
end
