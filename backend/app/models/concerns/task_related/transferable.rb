module TaskRelated::Transferable
  extend ActiveSupport::Concern

  def transfer_owner!(new_owner:)
    return unless new_owner.is_a?(Member)

    new_owner_id = new_owner.id
    new_group_id = new_owner.group_id

    update!(owner_id: new_owner_id, group_id: new_group_id)
  end

  def transferable?
    waiting? || completed?
  end
end
