class Factories::Template::Duplicate < ServiceCaller
  include StageCopier
  ENCRYPTABLE_SETTING_KEYS = %i[is_encrypted completion_password].freeze

  attr_reader :template

  def initialize(member, source_template, template_name, setting_info: {}, duplicate_tags: false, usage: :general)
    @member = member
    @source_template = source_template
    @template_name = template_name
    @setting_info = setting_info
    @duplicate_tags = duplicate_tags
    @usage = usage
    @attachment_id_map = {}
  end

  def call
    ActiveRecord::Base.transaction do
      duplicate_template
      duplicate_template_setting
      duplicate_dummy_stages
      duplicate_files
      duplicate_tags if @duplicate_tags
    end
    @result = build_result
  end

  private

  def duplicate_template
    @template = @source_template.deep_dup
    @template.file_name = @template_name if @template_name.present?
    @template.usage = @usage
    @template.has_order = true if @usage == :public_form
    @template.save!
  end

  def duplicate_template_setting
    source_setting = @source_template.setting_info(member_id: @member.id)
    setting_info = source_setting.merge(@setting_info).symbolize_keys.except(*ENCRYPTABLE_SETTING_KEYS)
    return if setting_info.blank?
    TemplateSetting.setup_from_request(@member.id, @template.id, setting_info)
  end

  def duplicate_dummy_stages
    last_base_stage_id = nil
    @source_template.dummy_stages.includes(:stage_setting, :field_setting_groups, :field_settings, :verify_methods, :xfdf_document).each do |source_stage|
      dummy_stage = source_stage.deep_dup
      dummy_stage.source = @template
      dummy_stage.actor_info['base_stage_id'] = last_base_stage_id if last_base_stage_id.present? && source_stage.action_review?
      dummy_stage.save!
      last_base_stage_id = dummy_stage.id if dummy_stage.action_sign?

      unless source_stage.action_review?
        copy_attachment_setting(dummy_stage, source_stage)
        copy_stage_setting(dummy_stage, source_stage)
        copy_field_setting_groups(dummy_stage, source_stage)
        copy_field_settings(dummy_stage, source_stage)
        copy_verify_methods(dummy_stage, source_stage)
        copy_xfdf(dummy_stage, source_stage)
        dummy_stage.save!
      end
    end
  end

  def copy_attachment_setting(dummy_stage, source_stage)
    dummy_stage.attachment_setting = format_stage_attachment_settings(dummy_stage, source_stage.attachment_setting)
  end

  def copy_stage_setting(dummy_stage, source_stage)
    return if source_stage.stage_setting.nil?
    new_stage_setting = source_stage.stage_setting.deep_dup
    new_stage_setting.stage = dummy_stage
    new_stage_setting.viewable_in_processing_attachments = source_stage.stage_setting.viewable_in_processing_attachments.map do |attachment_id|
      @attachment_id_map[attachment_id]
    end
    dummy_stage.stage_setting = new_stage_setting
  end

  def copy_field_setting_groups(dummy_stage, source_stage)
    @field_setting_group_map = {}
    dummy_stage.field_setting_groups = source_stage.field_setting_groups.map do |field_setting_group|
      new_field_setting_group = field_setting_group.deep_dup
      new_field_setting_group.source = @template
      new_field_setting_group.stage = dummy_stage
      @field_setting_group_map[field_setting_group.id] = new_field_setting_group
      new_field_setting_group
    end
  end

  def copy_field_settings(dummy_stage, source_stage)
    dummy_stage.field_settings = source_stage.field_settings.map do |field_setting|
      new_field_setting = field_setting.deep_dup
      new_field_setting.source = @template
      new_field_setting.stage = dummy_stage
      new_field_setting.field_setting_group = @field_setting_group_map[field_setting.field_setting_group_id]
      new_field_setting
    end
  end

  def copy_verify_methods(dummy_stage, source_stage)
    dummy_stage.verify_methods = source_stage.verify_methods.map do |verify_method|
      new_verify_method = verify_method.deep_dup
      new_verify_method.stage = dummy_stage
      new_verify_method
    end
  end

  def copy_xfdf(dummy_stage, source_stage)
    create_stage_xfdf_document(dummy_stage, source_stage.xfdf_document)
  end

  def duplicate_files
    create_files(@template, @source_template)
  end

  def duplicate_tags
    tags = @source_template.assigned_tags_by(@member)
    @member.tag(@template, with: tags, on: :tags) if tags.present?
  end

  def build_result
    {
      template_id: @template.id,
      template_name: @template.file_name,
      created_at: @template.created_at.to_i
    }
  end
end
