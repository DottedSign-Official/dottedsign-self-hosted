module TaskRelated::Actionable
  extend ActiveSupport::Concern

  def allowed_to_download_task?(member)
    owned_by_member?(member) || acted_by_member?(member)
  end

  def allowed_group_to_download_task?(member)
    false
  end

  def allowed_to_download_audit?(member)
    owned_by_member?(member) || acted_by_member?(member)
  end

  def allowed_group_to_download_audit?(member)
    false
  end

  def allowed_to_download_attachment?(member)
    return true if owned_by_member?(member)
    return false unless acted_by_member?(member)
    # check stage advanced setting
    true
  end

  def allowed_group_to_download_attachment?(member)
    false
  end
end
