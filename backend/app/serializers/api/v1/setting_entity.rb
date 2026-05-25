class Api::V1::SettingEntity < BaseEntity
  expose :message
  expose :completed_message
  expose :receiver_lang
  expose :forget_remind
  expose :display_deadline, as: :deadline
  expose :expire_remind
  expose :remind_days_before_expire
  expose :expires_in_days
  expose :need_otp_verify
  expose :cc_info
  expose :reference_setting
  expose :completed_reference_setting

  private

  alias :setting :object

  def message
    can_view_processing_message? ? setting.message : nil
  end

  def reference_setting
    can_view_processing_message? ? setting.reference_setting : []
  end

  def completed_message
    can_view_completed_message? ? setting.completed_message : nil
  end

  def completed_reference_setting
    can_view_completed_message? ? setting.completed_reference_setting : []
  end

  def can_view_processing_message?
    setting.source.can_view_processing_message?(member_id: options[:current_member].try(:id))
  end

  def can_view_completed_message?
    setting.source.can_view_completed_message?(member_id: options[:current_member].try(:id))
  end
end