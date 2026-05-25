module TaskRelated::Signable
  extend ActiveSupport::Concern

  FILE_PROCESSABLE_SIGN_TYPES = %w[create_and_invite form].freeze

  def signable?
    waiting?
  end

  def category_after_stage_sign(stage)
    return 'completed' if stages.on_going.blank?
    next_sequence = stages.where("sequence > ?", stage.sequence).minimum(:sequence)
    return 'waiting_for_others' if next_sequence.nil?
    next_stages = stages.where(sequence: next_sequence)
    next_stages.pluck(:actor_id).include?(stage.actor_id) ? 'waiting_for_me' : 'waiting_for_others'
  end

  def file_processable?
    FILE_PROCESSABLE_SIGN_TYPES.include?(sign_type)
  end
end
