class StageSetting < ApplicationRecord
  belongs_to :stage, polymorphic: true

  VALID_REQUISITE_VALUES = %w(required optional disabled).freeze

  def self.setup_from_request(stage_type, stage_id, setting_info, viewable_attachment_id_map: {})
    setting = StageSetting.find_or_initialize_by(stage_type: stage_type, stage_id: stage_id)
    setting.assign_attributes(Settings.default.stage_setting.merge(setting_info.to_h))
    setting.viewable_in_processing_attachments = [] unless setting.viewable_in_processing
    setting.viewable_in_processing_attachments = setting.viewable_in_processing_attachments.map do |attachment_id|
      viewable_attachment_id_map[attachment_id]
    end.compact if viewable_attachment_id_map.present?
    setting.save
  end

  def display_info
    as_json(only: [:forward_enable, :decline_enable, :viewable_in_processing, :viewable_in_completed, :viewable_in_processing_attachments, :reviewed_skip_confirm])
  end
end
