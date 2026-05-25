class GeneralWorker
  include Sidekiq::Worker
  FAIL_RETRY_IN = [5.minutes, 30.minutes, 1.hours, 2.hours, 3.hours].freeze
  sidekiq_options retry: FAIL_RETRY_IN.length
  sidekiq_retry_in do |retry_times|
    FAIL_RETRY_IN[retry_times].to_i
  end
end
