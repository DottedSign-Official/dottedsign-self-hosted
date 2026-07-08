class Api::V1::EnvelopeSettingsController < Api::ApplicationController
  include Api::V1::Envelopes::CheckHelper

  before_action :check_and_setup_envelope
  before_action :setup_stage_setting_hash

  def setup
    updater = EnvelopeSettingUpdater.call(@envelope, current_member.id, @stage_setting_hash, envelope_setting_params)
    return error_response(updater.error) if updater.failed?
    success_response(updater.result)
  end
end
