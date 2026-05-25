module Combination::GroupSearchable
  extend ActiveSupport::Concern

  class_methods do
    def related_ids(member)
      owned_combination_ids = Combination.where(owner_id: member.id).where('group_id is NULL or group_id = ?', member.group_id).pluck(:id)
      owned_combination_ids + shared_to(member).pluck(:id)
    end

    def related_to(member)
      Combination.where(id: related_ids(member))
    end

    def shared_to(member)
      member_role_ids = member.group_roles(member.group_id).pluck(:id)
      self.joins(:share_settings).where(share_settings: { target_type: 'Role', target_id: member_role_ids })
    end
  end
end
