class Api::V1::TaskSettingsController < Api::ApplicationController
  before_action :setup_task
  before_action :setup_stage_setting_hash

  def setup
    updater = SettingUpdater.call(@task, current_member.id, @stage_setting_hash, setting_params)
    return error_response(updater.error) if updater.failed?
    success_response(updater.result)
  end
end
