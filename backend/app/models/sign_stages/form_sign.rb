module SignStages
  class FormSign < SignStage
    include Stage::Reviewee
    include Stage::Signable

    belongs_to :actor, class_name: 'Member', foreign_key: :actor_id, optional: true
  end
end
