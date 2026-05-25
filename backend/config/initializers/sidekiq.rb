# frozen_string_literal: true
require 'sidekiq'
require 'sidekiq/web'
require "sidekiq/extensions/class_methods"

Rails.application.reloader.to_prepare do
  if OnPremiseLicense::PlanReader.enterprise?
    Sidekiq::Client.reliable_push! unless Rails.env.test?
  end

  Sidekiq.configure_server do |config|
    config.redis = Settings.redis.sidekiq.symbolize_keys.compact_blank
    if OnPremiseLicense::PlanReader.enterprise?
      config.super_fetch!
      config.reliable_scheduler!
    end
  end

  Sidekiq.configure_client do |config|
    config.redis = Settings.redis.sidekiq.symbolize_keys.compact_blank
  end
end
