class StartCheckWorker < GeneralWorker
  RETRY_IN = [2.seconds, 3.seconds, 5.seconds, 10.seconds, 15.seconds].freeze

  sidekiq_retry_in do |retry_times|
    RETRY_IN[retry_times].to_i
  end

  sidekiq_retries_exhausted do |msg, error|
    source_id = msg['args'].first
    source_type = msg['args'].second
    source = source_type.constantize.find_by_id(source_id)
    source.do_deleted
  end

  def perform(source_id, source_type = 'SignTask')
    source = source_type.constantize.find_by_id(source_id)
    return if source.nil?
    if source.can_start_now?
      source.do_waiting
    else
      raise "#{source_type} #{source.id} still can not start"
    end
  end
end
