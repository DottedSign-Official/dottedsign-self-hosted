class Api::V1::EnvelopeStageEntity < BaseEntity
  expose :source_id, as: :envelope_id
  expose :stage_type
  expose :id, as: :stage_id
  expose :stage_display_name, as: :name
  expose :email
  expose :status, as: :action_type
  expose :action
  expose :actor_info
  expose :icon_url

  expose :full_info, unless: :batch do
    expose :need_otp_verify
    expose :custom_message_setting
    expose :verify_methods, using: Api::V1::VerifyMethodEntity, if: ->(stage, _options) { stage.need_otp_verify? }
    expose :stage_setting
    expose :envelope_task_infos
  end

  alias :stage :object

  def stage_type
    stage.class.base_class.name
  end

  def stage_display_name
    stage.actor_id == options[:current_member].try(:id)? 'Me' : stage.actor_display_name
  end

  def icon_url
    stage.actor&.icon_url || Profile.default_icon_url
  end

  def need_otp_verify
    stage.need_otp_verify?
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

  def envelope_task_infos
    options[:task_stages_by_sequence][stage.sequence] || []
  end

end
