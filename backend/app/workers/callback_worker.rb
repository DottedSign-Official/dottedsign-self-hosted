class CallbackWorker < GeneralWorker
  REQUESTER = JsonRequester.new(Settings.callback.host, ssl_verify: true)
  RETRY_IN = [5.minutes, 30.minutes, 1.hours, 2.hours, 3.hours].freeze
  sidekiq_options queue: :low, retry: RETRY_IN.length
  sidekiq_retry_in do |retry_times|
    RETRY_IN[retry_times].to_i
  end

  def perform(source_type, source_id)
    source = source_type.safe_constantize.find_by_id(source_id)
    return unless source

    event = Settings.callback.event_for(source_type, source.status)
    return unless event && Settings.callback.enable_for(event)

    callback = Callback.find_or_create_by!(source_id: source_id, source_type: source_type, event: event)
    params = {
      source_id: source.id,
      source_type: source.class.base_class.name.underscore,
      event: event,
      status: source.status,
    }.merge(detail: source.callback_params)
    path = Settings.callback.event_path_for(event)
    response = REQUESTER.http_send(:post, path, params)
    add_log(params, response)

    if response['status'] == 200
      callback.done!
    else
      callback.touch
      raise "#{self.class.name} failed: #{response['message']} (error_code #{response['error_code']})"
    end
  end

  private

  def add_log(request_params, response)
    logger.info("[#{self.class.name}] request params: #{request_params.to_json} , response: #{response}") if response.present?
  end

  def logger
    @logger ||= Logger.new("#{Rails.root}/log/callback.log")
  end
end
