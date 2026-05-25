module SettingDisplayable

  def setting_info(member_id: nil)
    setting&.display_info(member_id: member_id) || default_setting_info
  end

  def default_setting_info
    {
      forget_remind: owner.forget_remind,
      message: nil,
      reference_setting: [],
      completed_message: nil,
      completed_reference_setting: [],
      cc_info: [],
      expire_remind: false,
      remind_days_before_expire: nil,
      deadline: nil,
      need_otp_verify: false,
      receiver_lang: owner.receiver_lang
    }
  end

end