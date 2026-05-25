class BulkSendWorker < GeneralWorker
  sidekiq_options queue: :low

  def perform(mission_id, mission_number)
    send_service = BulkSender.call(mission_id, mission_number)
    raise send_service.error if send_service.failed?
  end

end
