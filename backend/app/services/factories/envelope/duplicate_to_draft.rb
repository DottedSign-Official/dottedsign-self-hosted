class Factories::Envelope::DuplicateToDraft < ServiceCaller
  def initialize(original_envelope, member, client_info)
    @original_envelope = original_envelope
    @member = member
    @client_info = client_info
  end

  def call
    check_duplicable
    
    ActiveRecord::Base.transaction do
      duplicate_envelope
      duplicate_envelope_setting
      duplicate_stages
      duplicate_files
      duplicate_sign_tasks
      record_create_event
    end

    @result = @envelope
  end

  private

  def check_duplicable
    raise ServiceError.new(:envelope_not_duplicable) unless @original_envelope.duplicable?
  end

  def duplicate_envelope
    @envelope = Envelope.create(
      owner_id: @member.id,
      group_id: @member.active_group_id,
      envelope_name: @original_envelope.envelope_name,
      has_order: @original_envelope.has_order
    )
  end

  def duplicate_envelope_setting
    return if @original_envelope.envelope_setting.nil?

    new_setting = @original_envelope.envelope_setting.deep_dup
    new_setting.deadline = nil
    new_setting.expire_remind_at = nil
    new_setting.envelope = @envelope
    new_setting.save
  end

  def duplicate_stages
    last_base_stage_id = nil
    no_order_sequence = @original_envelope.stages.length
    @original_envelope.stages.includes(:stage_setting).order(:sequence).each do |original_stage|
      new_stage = original_stage.deep_dup
      new_stage.source = @envelope
      new_stage.status = 'initial'
      new_stage.sequence = no_order_sequence unless @envelope.has_order
      new_stage.actor_info['base_stage_id'] = last_base_stage_id if last_base_stage_id.present? && new_stage.action_review?
      new_stage.save
      last_base_stage_id = new_stage.id if new_stage.action_sign?

      duplicate_stage_setting_for(original_stage, new_stage)
    end
  end

  def duplicate_stage_setting_for(original_stage, new_stage)
    return unless original_stage.stage_setting.present?

    new_stage_setting = original_stage.stage_setting.deep_dup
    new_stage_setting.stage = new_stage
    new_stage_setting.save
  end

  def duplicate_files
    Envelope.setup_file_for(@envelope, 'original')

    %w[reference completed_reference].each do |file_type|
      @original_envelope.send("#{file_type}_files").each do |file|
        file.copy_to(@envelope, file.label, skip_callback: true)
      end
    end
  end

  def duplicate_sign_tasks
    @original_envelope.sign_tasks.each do |original_task|
      duplicator = Factories::SignTask::DuplicateToDraft.call(original_task, @member, @client_info)
      raise ServiceError.new(:envelope_duplicate_failed, error_message: duplicator.error.key) if duplicator.failed?
      @envelope.sign_tasks << duplicator.result
    end
  end

  def record_create_event
    @envelope.add_sign_event(:created, @member.id, client_info: @client_info, other_info: { duplicated_from: @original_envelope.id })
  end
end
