module DummyStages::Signable
  extend ActiveSupport::Concern

  def envelope_stage_do_done
    return unless SignStage.specific_sequence_in_envelope(source.id, sequence).all?(&:done?)
    self.done!
    mark_stage_last_action
    trigger_stage_done_callback
    trigger_next_stages
    trigger_completed_envelope
  end
end
