namespace :callback do
  desc 'retry callback'
  task :retry => :environment do |t, args|
    enable_events = Settings.callback.events.select { |event| event.enable }.keys
    Callback.where(status: :pending, event: enable_events).where('updated_at < ?', 8.hours.ago).each do |callback|
      CallbackWorker.perform_async(callback.source_type, callback.source_id)
    end
  end
end
