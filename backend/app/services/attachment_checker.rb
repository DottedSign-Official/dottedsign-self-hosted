class AttachmentChecker < ServiceCaller

  def initialize(file_id, member)
    @file_id = file_id
    @member = member
  end

  def call
    obtain_file
    check_file
    obtain_task
    obtain_stage
    check_permission
    @result = @file
  end

  private

  def check_file
    allowed_classes = ["SignStage", "DummyStage"]
    raise ServiceError.new(:file_not_match) unless allowed_classes.include?(@file.storable.class.base_class.name)
  end

  def obtain_file
    @file = ServiceFile.find_by_id(@file_id)
    raise ServiceError.new(:file_not_found) if @file.nil?
    raise ServiceError.new(:file_not_found) if @file.label.exclude?('attachment')
    raise ServiceError.new(:file_not_ready) unless @file.uploaded?
  end

  def obtain_task
    @task = @file.storable.source
    raise ServiceError.new(:task_not_found) if @task.nil?
    raise ServiceError.new(:task_not_accessible) if @task.deleted? || @task.expired? || @task.declined?
  end

  def obtain_stage
    @stage = @file.storable.is_a?(DummyStage) ? @file.storable : @task.stages.where(actor_id: @member.id).order(sequence: :desc).last
  end

  def check_permission
    return if @task.owner_id == @member.id || @task.group_id == @member.group_id
    raise ServiceError.new(:stage_not_found) if @stage.nil?
    viewable_in_completed = @stage&.stage_setting&.viewable_in_completed.nil? ? false : @stage.stage_setting.viewable_in_completed
    raise ServiceError.new(:file_not_viewable) if !viewable_in_completed && @task.completed?
    raise ServiceError.new(:file_not_viewable) unless @stage.viewable_attachments.pluck(:id).include?(@file_id)
  end

end
