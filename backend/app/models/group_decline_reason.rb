class GroupDeclineReason < ApplicationRecord
  belongs_to :group
  belongs_to :decline_reason

  validates :decline_reason_id, uniqueness: { scope: :group_id }
end
