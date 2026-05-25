module TaskRelated::Reissuable
  extend ActiveSupport::Concern

  def reissuable?
    create_and_invite? && waiting?
  end
end
