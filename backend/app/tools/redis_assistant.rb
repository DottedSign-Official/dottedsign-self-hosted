class RedisAssistant
  class << self
    def read_and_retry(cache_key)
      retry_times ||= 0
      return if retry_times >= 5
      cache_value = Rails.cache.read(cache_key)
      raise if cache_value.nil?
      cache_value
    rescue
      sleep 0.2
      retry_times += 1
      retry
    end
  end
end
