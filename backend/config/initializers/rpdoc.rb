# frozen_string_literal: true

Rpdoc.configure do |config|
  test_env_number = ENV['TEST_ENV_NUMBER'].to_s

  # (Optional) You can disable rpdoc generation process manually.
  # config.rpdoc_enable = true

  # (Optional) Apikey for your Postman account, used if want to push collection to the Postman server.
  config.postman_apikey = ''

  # (Optional) Workspace that your collection will be pushed to. Default your account's personal workspace.
  config.collection_workspace = ''

  # (Optional) Your existing collection uid. Will update it when using :push_and_update push strategy.
  config.collection_uid = ''

  # (Optional) Collection name.
  config.collection_name = 'Jackrabbit Server - Basic Rpdoc'

  # (Optional) Your Rails server API host.
  config.rspec_server_host = '{{rabbit_host}}'

  # (Optional) Since Rspec generates many noisy headers, you can filter them.
  # config.rspec_request_allow_headers = ['User-Agent', 'Content-Type', 'Authorization']

  # (Optional) Folder that Rpdoc use for json data generation and save.
  config.rpdoc_root = test_env_number.empty? ? 'rpdoc' : "tmp/rpdoc#{test_env_number}"

  # (Optional) Filename to store RSpec request json data.
  # config.rpdoc_request_filename = 'request.json'

  # (Optional) Filename to store Postman description markdown data.
  # config.rpdoc_description_filename = 'description.md'

  # (Optional) Filename to store RSpec collection json data.
  config.rpdoc_collection_filename = test_env_number.empty? ? 'collection.json' : "collection#{test_env_number}.json"

  # (Optional) Clean empty folders. You can specify folder names which will be ignored when cleaning.
  config.rpdoc_clean_empty_folders = true
  config.rpdoc_clean_empty_folders_except = ['Schemas']

  # (Optional) Auto push collection to Postman server or not.
  config.rpdoc_auto_push = false

  # (Optional) Auto push strategy, including :push_and_create and :push_and_update
  config.rpdoc_auto_push_strategy = :push_and_update
end
