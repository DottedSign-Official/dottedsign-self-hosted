module TaskRelated::Duplicable
  extend ActiveSupport::Concern

  DUPLICABLE_STATUSES = %w[declined expired].freeze

  def duplicable?
    return false unless file_processable?
    DUPLICABLE_STATUSES.include?(status)
  end

  def duplicable_by?(member)
    return false unless duplicable?
    return false unless owned_by_member?(member)
    true
  end
end