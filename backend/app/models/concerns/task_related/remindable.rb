module TaskRelated::Remindable
  extend ActiveSupport::Concern

  def forget_remindable?
    return false unless waiting?
    return false if setting.nil?
    return false unless setting.forget_remind
    return true unless setting.expire_remind
    return false if setting.deadline <= Time.zone.now
    expire_remind_day = setting.expire_remind_at.all_day
    !Time.zone.now.between?(expire_remind_day.first, expire_remind_day.last)
  end

  def need_inform?
    return true if setting.nil?
    setting.inform_enable != false
  end
end
