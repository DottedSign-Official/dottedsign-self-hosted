class Factories::Envelope::Updater < Factories::Envelope::Creator
  def initialize(member, envelope, envelope_params, tasks_params, client_params, setting_params)
    super(member, envelope_params, tasks_params, client_params, setting_params)
    @envelope = envelope
  end

  def call
    check_envelope

    ActiveRecord::Base.transaction do
      @result = @envelope.update_from_request(@envelope_params, @client_params, @setting_params)
      update_tasks
    end

    create_tags if @envelope_params.key?(:tags)
  end

  private

  def check_envelope
    raise ServiceError.new(:envelope_is_not_draft) unless @envelope.draft?
  end

  def update_tasks
    position = 0
    @result[:task_infos] = @tasks_params.each_with_object([]) do |task_params, task_infos|
      task = SignTask.find_by(id: task_params[:task_id])
      raise ServiceError.new(:task_not_found) if task.nil?
      position += 1
      task_params[:position] = position
      task_info = task.update_from_request(task_params, @client_params, task_setting_params)
      task_infos << task_info
    end
  end
end
