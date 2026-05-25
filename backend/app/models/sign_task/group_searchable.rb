class SignTask
  module GroupSearchable
    extend ActiveSupport::Concern

    include TaskRelated::GroupSearchable

    class_methods do

      def related_ids(member)
        owner_task_ids = active.where(owner_id: member.id).where("group_id is NULL or group_id = ?", member.group_id).pluck(:id)
        signer_task_ids = SignStage.actor_visible.where(actor_id: member.id).where("sign_stages.group_id is NULL or sign_stages.group_id = ?", member.group_id).pluck(:sign_task_id)
        related_task_ids = owner_task_ids + signer_task_ids
        related_task_ids.sort.uniq
      end

      def group_related_ids(group_id, include_member_ids=nil)
        if include_member_ids.nil?
          owner_task_ids = active.where(group_id: group_id).pluck(:id)
          signer_task_ids = SignStage.actor_visible.where(sign_stages: {group_id: group_id}).pluck(:sign_task_id)
        elsif include_member_ids.empty?
          owner_task_ids = signer_task_ids = []
        else
          owner_task_ids = active.where(group_id: group_id, owner_id: include_member_ids).pluck(:id)
          signer_task_ids = SignStage.actor_visible.where(sign_stages: {group_id: group_id}, actor_id: include_member_ids).pluck(:sign_task_id)
        end
        related_task_ids = owner_task_ids + signer_task_ids
        related_task_ids.sort.uniq
      end

    end

    def related_to_group_others?(member)
      owned_by_group_others?(member) || acted_by_group_others?(member)
    end

    def owned_by_group?(member)
      return false if group_id.nil?
      group_id == member.group_id
    end

    def acted_by_group?(member)
      signed_group_ids = sign_stages.pluck(:group_id).compact
      return false if signed_group_ids.blank?
      signed_group_ids.include?(member.group_id)
    end

  end
end
