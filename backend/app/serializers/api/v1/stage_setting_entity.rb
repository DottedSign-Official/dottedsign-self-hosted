class Api::V1::StageSettingEntity < BaseEntity
  expose :forward_enable
  expose :decline_enable
  expose :viewable_in_completed
  expose :viewable_in_processing
  expose :viewable_in_processing_attachments
  expose :reviewed_skip_confirm
end
