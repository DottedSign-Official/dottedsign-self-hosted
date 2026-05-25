class Callback < ApplicationRecord
  belongs_to :source, polymorphic: true

  enum status: [:pending, :done]
  enum event: [:task_completed, :envelope_completed, :stage_done]
end
