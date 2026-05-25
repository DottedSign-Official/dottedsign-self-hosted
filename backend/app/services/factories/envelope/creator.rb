class Factories::Envelope::Creator < ServiceCaller
  def initialize(member, envelope_params, tasks_params, client_params, setting_params)
    @member = member
    @envelope_params = envelope_params
    @tasks_params = tasks_params
    @client_params = client_params
    @setting_params = setting_params
  end

  def call
    ActiveRecord::Base.transaction do
      @result = Envelope.create_from_request(@envelope_params, @client_params, @setting_params)
      create_tasks
    end

    create_tags
  end

  private

  def create_tasks
    position = 0
    @result[:task_infos] = @tasks_params.each_with_object([]) do |task_params, task_infos|
      position += 1
      task_params[:envelope_id] = @result[:envelope_id]
      task_params[:position] = position
      task_info = SignTask.create_from_request(task_params, @client_params, task_setting_params)
      task_info[:envelope_file_id] = task_params[:envelope_file_id]
      task_infos << task_info
    end
  end

  def task_setting_params
    # To avoid uploading duplicate files, reference information is configured only at the envelope level.
    @setting_params.except(:reference_setting, :completed_reference_setting)
  end

  def create_tags
    @envelope ||= Envelope.find_by(id: @result[:envelope_id])
    @member.tag(@envelope, with: @envelope_params[:tags], on: :tags)
    @result[:tag_info] = @envelope.tag_info_for(@member.id)
  end
end
