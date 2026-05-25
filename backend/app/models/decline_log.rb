class DeclineLog < ApplicationRecord
  belongs_to :sign_task
  belongs_to :sign_stage
  belongs_to :sign_event
  belongs_to :decline_reason, optional: true

  def health_check_display
    {
      reply_to: reply_to.join(','),
      updated_at: updated_at
    }
  end
end
