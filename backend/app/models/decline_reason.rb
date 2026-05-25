class DeclineReason < ApplicationRecord
  validates :content, length: { maximum: 500 }, presence: true
  validate :system_reserved_reason_duplicate, if: Proc.new { |reason| reason.active? }

  has_many :group_decline_reasons, dependent: :destroy
  has_many :groups, through: :group_decline_reasons

  enum status: [:active, :deleted]

  scope :active_system_reserved, -> { where(system_reserved: true).where(status: :active) }

  def check_associated_with_group
    return if system_reserved
    destroy if groups.count == 0
  end

  private

  def system_reserved_reason_duplicate
    errors.add(:content, 'duplicate') if DeclineReason.active_system_reserved.pluck(:content).include?(content)
  end

end
