class Api::V1::TemplateStageEntity < BaseEntity
  expose :id, as: :stage_id
  expose :role
  expose :sequence
  expose :action
  expose :actor_info

  expose :full_info, merge: true, unless: :batch do
    expose :attachment_setting
    expose :attachment_count
    expose :pdf_object_info
    expose :field_settings, using: Api::V1::FieldSettingEntity
    expose :field_setting_groups, using: Api::V1::FieldSettingGroupEntity
    expose :xfdf_text, if: { with_xfdf: true }
    expose :verify_methods, using: Api::V1::VerifyMethodEntity, if: ->(entity, _options) { entity.need_otp_verify? }
    expose :stage_setting
  end

  alias :stage :object

  def role
    stage.actor_info['role']
  end

  def attachment_count
    stage.attachment_setting&.length || 0
  end

  def xfdf_text
    stage.xfdf_document&.content
  end

  def stage_setting
    stage.stage_setting&.display_info || Settings.default.stage_setting
  end

end
