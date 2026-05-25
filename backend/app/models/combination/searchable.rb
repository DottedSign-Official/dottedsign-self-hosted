module Combination::Searchable
  extend ActiveSupport::Concern

  class_methods do
    def related_ids(member)
      Combination.where(owner_id: member.id, group_id: member.group_id).pluck(:id)
    end

    def related_to(member)
      Combination.where(id: related_ids(member))
    end
  end
end
