module DummyStages
  class Review < DummyStage
    include Stage::Reviewer

    belongs_to :reviewer, class_name: 'Member', optional: true
  end
end
