module TaskRelated::Searchable
  extend ActiveSupport::Concern

  class_methods do
    def search_by_tags(tags, member)
      self.tagged_with(tags, owned_by: member, on: :tags, any: true).pluck(:id)
    end
  end

  def related_to_member?(member)
    owned_by_member?(member) || acted_by_member?(member)
  end

  def owned_by_member?(member)
    owner_id == member.id
  end

  def acted_by_member?(member, action: nil, status_scope: nil)
    related_stages = stages
    related_stages = related_stages.where(action: action) if action.present?
    related_stages = related_stages.send(status_scope) if status_scope.present?
    related_stages.pluck(:actor_id).include?(member.id)
  end

  def owned_by_group_others?(member)
    false
  end

  def acted_by_group_others?(member)
    false
  end
end
