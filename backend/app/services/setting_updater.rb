class SettingUpdater < ServiceCaller

  def initialize(source, member_id, stage_setting_hash, setting_params)
    @source = source
    @member_id = member_id
    @stage_setting_hash = stage_setting_hash
    @setting_params = setting_params
  end

  def call
    setup_source_setting

    ActiveRecord::Base.transaction do
      update_source_setting
      update_stage_settings
    end

    @result = @source_setting.display_info(member_id: @member_id)
  end

  private

  def setup_source_setting
    @source_setting = @source.setting
    @source_setting.update_setting_only = true
  end

  def update_source_setting
    @source_setting.update!(@setting_params)
  end

  def update_stage_settings
    @source.stages.map do |stage|
      stage_setting = StageSetting.find_or_initialize_by(stage_type: stage.class.base_class.name, stage_id: stage.id)
      stage_setting.assign_attributes(@stage_setting_hash[stage.id]) if @stage_setting_hash[stage.id].present?
      stage_setting.save!
    end
  end
end