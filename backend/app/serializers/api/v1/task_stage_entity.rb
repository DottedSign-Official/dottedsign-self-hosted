class Api::V1::TaskStageEntity < BaseEntity
  expose :source_id, as: :task_id
  expose :stage_type
  expose :id, as: :stage_id
  expose :stage_display_name, as: :name
  expose :stage_display_email, as: :email
  expose :status, as: :action_type
  expose :action
  expose :actor_info
  expose :icon_url

  expose :full_info, unless: :batch do
    expose :pdf_object_info
    expose :need_otp_verify
    expose :attachment_setting
    expose :attachment_count
    expose :custom_message_setting
    expose :field_settings, using: Api::V1::FieldSettingEntity
    expose :field_setting_groups, using: Api::V1::FieldSettingGroupEntity
    expose :xfdf_content, as: :xfdf_text, if: { with_xfdf: true }
    expose :verify_methods, using: Api::V1::VerifyMethodEntity, if: ->(entity, _options) { entity.need_otp_verify? }
    expose :stage_setting
  end

  alias :stage :object

  def stage_type
    stage.class.base_class.name
  end

  def stage_display_name
    stage.actor_id == options[:current_member].try(:id) ? 'Me' : stage.actor_display_name
  end

  def stage_display_email
    stage.actor_display_email
  end

  def need_otp_verify
    stage.need_otp_verify?
  end

  def icon_url
    stage.actor&.icon_url || Profile.default_icon_url
  end

  def attachment_setting
    stage.is_a?(SignStage) ? stage.attachment_setting_with_thumbnail : stage.attachment_setting
  end

  def attachment_count
    stage.attachments.length
  end

  def custom_message_setting
    {
      processing_viewable: stage.custom_message_setting&.dig('processing_viewable') || false,
      completed_viewable: stage.custom_message_setting&.dig('completed_viewable') || false
    }
  end

  def stage_setting
    if stage.stage_setting.present?
      Api::V1::StageSettingEntity.represent(stage.stage_setting, options)
    else
      Settings.default.stage_setting
    end
  end
end
