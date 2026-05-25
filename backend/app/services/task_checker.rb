class TaskChecker < ServiceCaller

  def initialize(task_id, member, check_action: 'view_task', ownership: false)
    @task_id = task_id
    @member = member
    @check_action = check_action
    @ownership = ownership
    @source_name = 'task'
  end

  def call
    obtain_task
    check_accessibility
    check_ownership if @ownership
    check_deleted
    @result = @source
  end

  private

  def obtain_task
    @source = @task = SignTask.find_by_id(@task_id)
    raise ServiceError.new(:task_not_found) if @task.nil?
  end

  def check_accessibility
    accessibility = @source.accessibility_of(@member, @check_action)
    raise ServiceError.new(accessibility) unless accessibility == :accessible
  end

  def check_ownership
    raise ServiceError.new(generate_error_key(:not_owned)) unless @source.owned_by_member?(@member)
  end

  def check_deleted
    raise ServiceError.new(generate_error_key(:deleted)) if @source.deleted?
  end

  def generate_error_key(error_name)
    "#{@source_name}_#{error_name}".to_sym
  end

end
