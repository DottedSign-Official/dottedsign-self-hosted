class StageViewableAttachments < ServiceCaller

  def initialize(source_id, stage_id, member_id, source_type = 'SignTask')
    @source_id = source_id
    @stage_id = stage_id
    @member_id = member_id
    @source_type = source_type
  end

  def call
    obtain_member
    obtain_stage
    obtain_source
    @result = viewable_attachments || []
  end

  private

  def obtain_member
    @reader = Member.find_by_id(@member_id)
    raise ServiceError.new(:member_not_found) if @reader.nil?
  end

  def obtain_stage
    return if @stage_id.nil?
    stage_class = @source_type == 'Envelope' ? DummyStage : SignStage
    @stage = stage_class.find_by_id(@stage_id)
    raise ServiceError.new(:stage_not_found) if @stage.nil?
  end

  def obtain_source
    @source = @source_type.constantize.find_by(id: @source_id)
    error_key = @source_type == 'Envelope' ? :envelope_not_found : :task_not_found
    raise ServiceError.new(error_key) if @source.nil?
  end

  def viewable_attachments
    viewable_in_completed = false

    if @source.completed?
      @stages = @source.stages.includes(:stage_setting).where(actor_id: @member_id)
      viewable_in_completed = @stages.any? { |stage| stage&.stage_setting&.viewable_in_completed }
    end

    files = if check_same_group_or_owner?
              @source.stage_attachment_files
            elsif !viewable_in_completed && @source.completed?
              []
            elsif viewable_in_completed && @source.completed?
              @stages.map do |stage|
                stage.viewable_attachments
              end.flatten.uniq(&:id)
            else
              @stage.viewable_attachments
            end

    attachments = files.map do |file|
      attachment_info = {
        task_id: file.storable.source_id,
        actor_name: file.storable&.actor&.display_name || file.storable.actor_info["name"],
        file_name: file.storable.attachment_setting.find { |setting| "#{setting['attachment_id']}" == file.label }&.dig('file_name'),
        file_id: file.id,
        attachment_id: file.label
      }
      attachment_info[:reviewable] = file.storable_id == @stage.base_stage.id if @stage&.action_review?
      attachment_info
    end
    attachments.sort_by { |attachment| [attachment[:actor_name], attachment[:file_name]] }
  end

  def check_same_group_or_owner?
    return true if @source.owner_id == @reader.id
    return false if @source.group_id.nil? || @reader.group_id.nil?
    @source.group_id == @reader.group_id
  end

end
