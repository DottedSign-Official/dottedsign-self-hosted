class Envelope
  module Transferable
    extend ActiveSupport::Concern

    include TaskRelated::Transferable

    def transfer_owner!(new_owner:)
      return unless new_owner.is_a?(Member)

      new_owner_id = new_owner.id
      new_group_id = new_owner.group_id

      ActiveRecord::Base.transaction do
        now = Time.current
        sign_tasks.update_all(owner_id: new_owner_id, group_id: new_group_id, updated_at: now)
        update!(owner_id: new_owner_id, group_id: new_group_id, updated_at: now)
      end
    end
  end
end
