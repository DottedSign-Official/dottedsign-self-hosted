class Factories::Template::FromTask < ServiceCaller
  include StageCopier

  def initialize(member_id, source_task, template_name)
    @member_id = member_id
    @source_task = source_task
    @template_name = template_name
  end

  # Items to be duplicated:
  # - file_name
  # - has_order
  # - stages & review_stages (only with field_settings and attachment_settings)
  # - original_file, full_file
  def call
    ActiveRecord::Base.transaction do
      create_template
      create_template_setting
      create_dummy_stages
      create_template_files
    end
    @result = build_result
  end

  private

  def create_template
    @template = Template.create!(
      owner_id: @member_id,
      file_name: @template_name || "#{@source_task.file_name} copy",
      group_id: @current_group_id,
      has_order: @source_task.has_order
    )
  end

  def create_template_setting
    @template.create_template_setting(@source_task.task_setting.slice(:forget_remind, :receiver_lang))
  end

  def create_dummy_stages
    # TODO: use import create stages
    last_base_stage_id = nil
    @source_task.stages.includes(:field_setting_groups).each do |source_stage|
      dummy_stage = DummyStage.new(
        source_type: 'Template',
        source_id: @template.id,
        sequence: source_stage.sequence,
        action: source_stage.action_form_sign? ? 'sign' : source_stage.action,
        actor_info: { role: source_stage.actor_display_name },
        pdf_object_info: source_stage.pdf_object_info
      )
      dummy_stage.actor_info[:base_stage_id] = last_base_stage_id if last_base_stage_id.present? && source_stage.action_review?
      dummy_stage.save!
      last_base_stage_id = dummy_stage.id if dummy_stage.action_sign?
      next if source_stage.action_review?

      copy_attachment_setting(dummy_stage, source_stage)
      copy_stage_setting(dummy_stage, source_stage)
      copy_field_setting_groups(dummy_stage, source_stage)
      copy_field_settings(dummy_stage, source_stage)
      copy_verify_methods(dummy_stage, source_stage)
      copy_xfdf(dummy_stage, source_stage)
    end
  end

  def copy_attachment_setting(dummy_stage, source_stage)
    dummy_stage.attachment_setting = format_stage_attachment_settings(
      dummy_stage,
      source_stage.attachment_setting.map do |setting|
        setting.deep_symbolize_keys.slice(:file_name, :force, :viewable_in_processing)
      end
    )
    # attachment_setting is a field not an association, need to save manually
    dummy_stage.save
  end

  def copy_stage_setting(dummy_stage, source_stage)
    create_stage_stage_setting(
      dummy_stage,
      source_stage.stage_setting&.slice('reviewed_skip_confirm')&.deep_symbolize_keys || {}
    )
  end

  def copy_field_setting_groups(dummy_stage, source_stage)
    create_stage_field_setting_groups(
      dummy_stage,
      source_stage.field_setting_groups.map do |field_setting_group|
        field_setting_group.slice('field_group_type', 'field_group_object_id', 'options').deep_symbolize_keys
      end
    )
  end

  def copy_field_settings(dummy_stage, source_stage)
    create_stage_field_settings(
      dummy_stage,
      source_stage.field_settings.map do |field_setting|
        field_setting_attrs = field_setting.slice('field_type', 'field_object_id', 'coord', 'page', 'options').deep_symbolize_keys.merge(field_group_object_id: field_setting.field_setting_group&.field_group_object_id)
        field_setting_attrs.deep_merge(options: { default: nil }) if field_setting_attrs[:field_type] == 'signature'
        field_setting_attrs
      end
    )
  end

  def copy_verify_methods(dummy_stage, source_stage)
    create_stage_verify_methods(
      dummy_stage,
      source_stage.verify_methods.map do |verify_method|
        verify_method.slice('verify_type', 'verify_source', 'sequence', 'occassion').deep_symbolize_keys
      end
    )
  end

  def copy_xfdf(dummy_stage, source_stage)
    create_stage_xfdf_document(dummy_stage, source_stage.xfdf_document)
  end

  def create_template_files
    create_files(@template, @source_task)
  end

  def build_result
    {
      template_id: @template.id,
      template_name: @template.file_name,
      created_at: @template.created_at.to_i
    }
  end
end
