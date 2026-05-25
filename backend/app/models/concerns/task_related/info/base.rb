module TaskRelated::Info::Base
  extend ActiveSupport::Concern

  def cc_members
    cc_info = Array(setting&.cc_info)
    emails = cc_info.map { |i| i['email'] }.compact.uniq
    return Member.none if emails.empty?

    Member.includes(:profile).where(email: emails)
  end

  def owner_info
    raise NotImplementedError
  end

  def task_name
    raise NotImplementedError
  end

  def stages_for_notification(stage_ids)
    raise NotImplementedError
  end
end
