module SignEvents
  class ChangeEvent < SignEvent

    def forward_by
      sign_task.owner_id == action_member_id ? :owner : :signer
    end

    def detail_display
      {
        old_email: other_info['old_email'],
        new_email: other_info['new_email'],
        forward_by: forward_by,
        updated_at: created_at
      }
    end

  end
end
