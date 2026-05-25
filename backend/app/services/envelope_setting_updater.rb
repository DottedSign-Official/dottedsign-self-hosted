class EnvelopeSettingUpdater < SettingUpdater

  def initialize(source, member_id, stage_setting_hash, setting_params)
    super(source, member_id, stage_setting_hash, setting_params)
  end

  def call
    setup_source_setting
    setup_sign_stage_setting_hash

    ActiveRecord::Base.transaction do
      update_source_setting
      update_task_settings
      update_stage_settings
    end

    @result = @source_setting.display_info(member_id: @member_id)
  end

  private

  def setup_sign_stage_setting_hash
    stage_setting_by_sequence = @source.dummy_stages.each_with_object({}) do |dummy_stage, hash|
      hash[dummy_stage.sequence] = @stage_setting_hash[dummy_stage.id] if @stage_setting_hash[dummy_stage.id].present?
    end
    @sign_stage_setting_hash = {}
    @source.sign_tasks.flat_map(&:sign_stages).each do |sign_stage|
      @sign_stage_setting_hash[sign_stage.id] = stage_setting_by_sequence[sign_stage.sequence] if stage_setting_by_sequence[sign_stage.sequence].present?
    end
  end

  def update_task_settings
    @source.sign_tasks.map do |task|
      SettingUpdater.call(task, @member_id, @sign_stage_setting_hash, @setting_params)
    end
  end
end