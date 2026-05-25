require_relative "boot"

require "rails"
# Pick the frameworks you want:
require "active_model/railtie"
require "active_job/railtie"
require "active_record/railtie"
require "active_storage/engine"
require "action_controller/railtie"
require "action_mailer/railtie"
# require "action_mailbox/engine"
# require "action_text/engine"
require "action_view/railtie"
require "action_cable/engine"
# require "sprockets/railtie"
# require "rails/test_unit/railtie"


# Require the gems listed in Gemfile, including any gems
# you've limited to :test, :development, or :production.
Bundler.require(*Rails.groups)

module JackrabbitServer
  class Application < Rails::Application
    # Initialize configuration defaults for originally generated Rails version.
    config.load_defaults 6.1

    # Configuration for the application, engines, and railties goes here.
    #
    # These settings can be overridden in specific environments using the files
    # in config/environments, which are processed later.
    #
    # config.time_zone = "Central Time (US & Canada)"
    # config.eager_load_paths << Rails.root.join("extras")

    # Only loads a smaller set of middleware suitable for API only apps.
    # Middleware like session, flash, cookies can be added back manually.
    # Skip views, helpers and assets when generating a new resource.
    config.api_only = true

    config.i18n.load_path += Dir[Rails.root.join('config', 'locales', '**', '*.{rb,yml}')]

    require_relative '../app/services/on_premise_password/decrypt'
    require_relative 'initializers/extensions/object'
    config.autoload_paths << "#{Rails.root}/lib"
    config.autoload_once_paths << "#{root}/app/settings"
    require_relative '../app/settings/settings'

    # Rails 6.1.6.1 does not support unsafe_yaml_load; need to add permitted allow factory bot success import mock data.
    # Can be close all safe_yaml_load with the setting `config.active_record.use_yaml_unsafe_load = true`
    config.active_record.yaml_column_permitted_classes = []

  end
end
