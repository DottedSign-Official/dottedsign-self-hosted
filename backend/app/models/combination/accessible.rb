module Combination::Accessible
  extend ActiveSupport::Concern

  def accessibility_of(member, check_action: 'show')
    case check_action
      when 'show'
        (owned_by_member?(member) || share_to_member?(member)) ? :accessible : :not_accessible
      else
        owned_by_member?(member) ? :accessible : :not_accessible
    end
  end

  def owned_by_member?(member)
    owner_id == member.id
  end

  def share_to_member?(member)
    ShareSetting.find_by(shared_type: "Combination", shared_id: id, target_type: "Role", target_id: member.current_role_ids).present?
  end
end
