module SignStages
  class Review < SignStage
    include Stage::Reviewer

    belongs_to :reviewer, class_name: 'Member', foreign_key: :actor_id, optional: true

    def viewable_attachments
      base_stage.viewable_attachments(include_self_attachment: true)
    end
  end
end
