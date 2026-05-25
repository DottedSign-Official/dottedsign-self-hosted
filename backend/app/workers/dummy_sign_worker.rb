class DummySignWorker < GeneralWorker

  def perform(task_id, stage_id, stringify_signature_infos)
    sign_info = {
      signature_info: stringify_signature_infos.map(&:with_indifferent_access),
      dummy_stage_id: stage_id
    }
    sign = Dummy::Sign.call(task_id, sign_info)
    raise sign.error if sign.failed?
  end

end
