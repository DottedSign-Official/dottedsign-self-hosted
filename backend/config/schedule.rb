# Use this file to easily define all of your cron jobs.
#
# It's helpful, but not entirely necessary to understand cron before proceeding.
# http://en.wikipedia.org/wiki/Cron

# Example:
#
# set :output, "/path/to/my/cron_log.log"
#
# every 2.hours do
#   command "/usr/bin/some_great_command"
#   runner "MyModel.some_method"
#   rake "some:great:rake:task"
# end
#
# every 4.days do
#   runner "AnotherModel.prune_old_records"
# end

# Learn more: http://github.com/javan/whenever
ENV.each { |k, v| env(k, v) }
set :environment, ENV['RAILS_ENV']
set :output, {:error => "/jackrabbit/log/cron.error.log", :standard => "/jackrabbit/log/cron.standard.log"}

every 15.minutes do
  rake 'clean:draft_failed_task'
  rake 'clean:sign_and_send_failed_task'
  rake 'clean:processing_templates'
end

every 1.hours, at: '00:30am' do
  rake 'sign:forget_remind[2]'
  rake 'sign:forget_remind[6]'
  rake 'callback:retry'
end

every 1.hour, at: '00:40am' do
  rake 'sign:expire_remind'
  rake 'clean:before_complete_task'
end

every 1.day, at: '00:50am' do
  rake 'clean:unused_photo_signature'
end
