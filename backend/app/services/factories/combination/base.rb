class Factories::Combination::Base < ServiceCaller
  def initialize(member, combination_attrs)
    @member = member
    @combination_attrs = combination_attrs
    @stage_attrs = combination_attrs[:stages]
  end

  def call
    ActiveRecord::Base.transaction do
      create_combination
      create_dummy_stages
    end
    @result = @combination
  end

  protected

  def create_combination
    @combination = Combination.create(
      owner_id: @member.id,
      group_id: @member.active_group_id,
      name: @combination_attrs[:name],
      description: @combination_attrs[:description],
      has_order: @combination_attrs[:has_order] || false,
      quantity: @stage_attrs.length
    )
  end

  def create_dummy_stages
    stage_count = @stage_attrs.length unless @combination.has_order
    @dummy_stages = @stage_attrs.map.with_index do |stage_info, index|
      DummyStage.new({
        source_type: 'Combination',
        source_id: @combination.id,
        sequence: stage_count || (index + 1),
        actor_info: stage_info.slice(:name, :email)
      })
    end
    DummyStage.import(@dummy_stages)

    @stage_attrs.each_with_index do |stage_attr, index|
      stage = @dummy_stages[index]
      create_stage_stage_setting(stage, stage_attr[:stage_setting] || {})
      # create_stage_verify_methods(stage, stage_attr[:verify]) if stage_attr[:verify].present?
      # TODO: 檢查與退回相關程式碼待功能完成後再加入
      # create_stage_review_stages(stage, stage_attr[:review_stages]) if stage_attr[:review_stages].present?
    end
    DummyStage.import(@dummy_stages, validate: true, on_duplicate_key_update: DummyStage.column_names.map(&:to_sym))
  end

  def create_stage_stage_setting(stage, stage_setting_attr)
    stage_setting = StageSetting.new(stage: stage)
    stage_setting.assign_attributes(Settings.default.stage_setting.symbolize_keys.merge(stage_setting_attr))
    stage.stage_setting = stage_setting
  end

  def create_stage_verify_methods(stage, verify_infos)
    verify_infos.each_with_index do |verify_info, index|
      sequence = verify_info[:sequence] || stage.verify_methods.count + 1
      stage.verify_methods << VerifyMethod.new(sign_stage: stage, execute_type: :normal, verify_type: verify_info[:verify_type], verify_source: verify_info[:verify_source], occassion: verify_info[:occassion], sequence: sequence)
    end
  end

  # TODO: 檢查與退回相關程式碼待功能完成後再加入
  # def create_stage_review_stages(stage, review_stage_attrs)
  #   review_stage_attrs.each_with_index do |review_stage_attr, index|
  #     base_stage_index = review_stage_attr[:base_stage_sequence] - 1
  #     base_stage = @dummy_stages[base_stage_index] if review_stage_attr[:base_stage_sequence] > 0
  #     reviewer_info = { checked_by_owner: true } if review_stage_attr[:base_stage_sequence].zero?
  #     review_stage =  ReviewStage.new(
  #       stage: stage,
  #       base_stage: base_stage,
  #       sequence: index + 1,
  #       reviewer_info: reviewer_info || base_stage&.actor_info
  #     )
  #     create_stage_verify_methods(review_stage, @stage_attrs[base_stage_index][:verify_methods]) if @stage_attrs[base_stage_index][:verify_methods]
  #     stage.review_stages << review_stage
  #   end
  # end
end
