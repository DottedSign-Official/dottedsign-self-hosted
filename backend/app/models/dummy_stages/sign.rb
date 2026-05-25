module DummyStages
  class Sign < DummyStage
    include Stage::Declineable
    include Stage::Reissuable
    include Stage::Reviewee
    include Stage::Signable
    include Signable

    belongs_to :actor, class_name: 'Member', optional: true
  end
end
