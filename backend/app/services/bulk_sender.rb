class BulkSender < ServiceCaller

  def initialize(mission_id, mission_number)
    @mission_id = mission_id
    @mission_number = mission_number
  end

  def call
    setup_mission
    obtain_task_info
    process_setting_info
    create_task_from_template
    start_task
    clear_mission
  end

  private

  def setup_mission
    @mission = BulkMission.find_by_id(@mission_id)
    raise ServiceError.new(:mission_not_found) if @mission.nil?
  end

  def obtain_task_info
    @task_info = RedisAssistant.read_and_retry("bulk:#{@mission.uuid}:#{@mission_number}")
    raise ServiceError.new(:no_task_info) if @task_info.nil?

    @task_info = @task_info.with_indifferent_access
    @task_info[:mission_id] = @mission.id
  end

  def process_setting_info
    @setting_info = @mission.setting_info
    @setting_info[:message] = @task_info.delete(:message)
  end

  def create_task_from_template
    create_service = Factories::TemplateTask::CreateAndInvite.call(@mission.owner, @mission.template_id, @task_info, setting_info: @setting_info, client_info: @mission.client_info, check_access: true)
    raise create_service.error if create_service.failed?
    @task = create_service.task
  end

  def start_task
    @task.start(@mission.client_info.symbolize_keys)
  end

  def clear_mission
    Rails.cache.delete("bulk:#{@mission.uuid}:#{@mission_number}")
  end

end
