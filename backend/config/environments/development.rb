require "active_support/core_ext/integer/time"

Rails.application.configure do
  config.hosts.clear

  # Settings specified here will take precedence over those in config/application.rb.
  config.action_cable.allowed_request_origins = [/http:\/\/*/, /https:\/\/*/, /file:\/\/*/, 'file://', nil, 'null']

  # In the development environment your application's code is reloaded any time
  # it changes. This slows down response time but is perfect for development
  # since you don't have to restart the web server when you make code changes.
  config.cache_classes = false

  # Do not eager load code on boot.
  config.eager_load = true

  # Show full error reports.
  config.consider_all_requests_local = true

  # Enable/disable caching. By default caching is disabled.
  # Run rails dev:cache to toggle caching.
  if Rails.root.join('tmp', 'caching-dev.txt').exist?
    config.cache_store = :memory_store
    config.public_file_server.headers = {
      'Cache-Control' => "public, max-age=#{2.days.to_i}"
    }
  else
    config.action_controller.perform_caching = false

    config.cache_store = :redis_cache_store, Settings.redis.default.symbolize_keys.compact_blank
  end

  # Store uploaded files on the local file system (see config/storage.yml for options).
  config.active_storage.service = (ENV['STORAGE_SERVICE']&.to_sym || :local)

  config.active_job.queue_adapter = :sidekiq

  # Don't care if the mailer can't send.
  config.action_mailer.raise_delivery_errors = true
  config.action_mailer.perform_caching = false
  config.action_mailer.delivery_method = ENV['MAIL_DELIVERY_METHOD']&.to_sym || :smtp

  smtp_setting = {
    address: ENV['SMTP_HOST'].env_presence || 'smtp.gmail.com',
    port: ENV['SMTP_PORT'].env_presence || 587,
    domain: ENV['SMTP_DOMAIN'],
    user_name: ENV['SMTP_USER'],
    password: ENV['SMTP_PASSWORD'] || OnPremisePassword::Decrypt.call(ENV['CRYPTO_SMTP_PASSWORD'].env_presence)&.result,
    open_timeout: 15,
    read_timeout: 15,
    enable_starttls_auto: true,
    openssl_verify_mode:  ENV['SMTP_OPENSSL_VERIFY_MODE'].env_presence ||  'none'
  }.compact_blank

  smtp_setting[:authentication] = ENV['SMTP_AUTH'] == 'none' ? nil : ENV['SMTP_AUTH'].env_presence || 'plain'

  config.action_mailer.smtp_settings = smtp_setting

  # Print deprecation notices to the Rails logger.
  config.active_support.deprecation = :log

  # Raise exceptions for disallowed deprecations.
  config.active_support.disallowed_deprecation = :raise

  # Tell Active Support which deprecation messages to disallow.
  config.active_support.disallowed_deprecation_warnings = []

  # Raise an error on page load if there are pending migrations.
  config.active_record.migration_error = :page_load

  # Highlight code that triggered database queries in logs.
  config.active_record.verbose_query_logs = true

  # Raises error for missing translations.
  # config.i18n.raise_on_missing_translations = true

  # Annotate rendered view with file names.
  # config.action_view.annotate_rendered_view_with_filenames = true

  # Use an evented file watcher to asynchronously detect changes in source code,
  # routes, locales, etc. This feature depends on the listen gem.
  config.file_watcher = ActiveSupport::FileUpdateChecker

  # Uncomment if you wish to allow Action Cable access from any origin.
  # config.action_cable.disable_request_forgery_protection = true
end
