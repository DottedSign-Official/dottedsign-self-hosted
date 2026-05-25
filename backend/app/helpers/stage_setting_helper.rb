module StageSettingHelper
  def setup_stage_setting_hash
    @stage_setting_hash ||= params[:stages]&.each_with_object({}) do |stage_setting, hash|
      hash[stage_setting[:stage_id]] = stage_setting.permit(*StageSetting.column_names)
    end
    @stage_setting_hash ||= {}
  end
end