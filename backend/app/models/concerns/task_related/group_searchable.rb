module TaskRelated::GroupSearchable
  extend ActiveSupport::Concern

  def related_to_group?(gid)
    return false if gid.nil?
    return true if group_id == gid
    sign_stages.pluck(:group_id).include?(gid)
  end

  def owned_by_member?(member)
    owner_id == member.id && (group_id.nil? || group_id == member.group_id)
  end

  def acted_by_member?(member, action: nil, status_scope: nil)
    group_actor_maps = actor_maps(action: action, status_scope: status_scope)
    group_actor_maps.include?([member.id, member.group_id]) || group_actor_maps.include?([member.id, nil])
  end

  def owned_by_group_others?(member)
    owner_id != member.id && group_id == member.group_id
  end

  def acted_by_group_others?(member, action: nil, status_scope: nil)
    actor_maps(action: action, status_scope: status_scope).find do |actor_id, group_id|
      actor_id != member.id && group_id == member.group_id
    end.present?
  end

  private

  def actor_maps(action: nil, status_scope: nil)
    related_stages = sign_stages
    related_stages = related_stages.where(action: action) if action.present?
    related_stages = related_stages.send(status_scope) if status_scope.present?
    related_stages.pluck(:actor_id, :group_id)
  end
end
