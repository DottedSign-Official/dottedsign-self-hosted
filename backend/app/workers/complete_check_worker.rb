class CompleteCheckWorker < GeneralWorker
  RETRY_IN = [30.seconds, 1.minute, 2.minutes, 3.minutes, 5.minutes].freeze

  sidekiq_retry_in do |retry_times|
    RETRY_IN[retry_times]
  end

  sidekiq_retries_exhausted do |msg, error|
    source_id = msg['args'].first
    source_type = msg['args'].second
    source = source_type.constantize.find_by_id(source_id)
    source.add_sign_event(:pending, other_info: { reason: 'fail to complete' })
  end

  def perform(source_id, source_type = 'Envelope')
    source = source_type.constantize.find_by_id(source_id)
    return if source.nil?
    if source.can_complete_now?
      source.do_completed
    else
      raise "#{source_type} #{source.id} still can not complete"
    end
  end
end
