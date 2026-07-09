class SignTaskProcess::ReadableFileProcessor < ServiceCaller
  def initialize(service_file, ids)
    @service_file = service_file
    @ids = ids
    @generator = nil
  end

  def call
    generate
    @result = @result_path
  rescue
    cleanup
    raise
  end

  def cleanup
    FileUtils.rm_rf(@generator.working_dir) if @generator&.working_dir.present?
  end

  private

  def generate
    generator = KmpdfTool::ReadableFileGenerator.call(@ids[:task_id], @ids[:stage_id])
    raise generator.error if generator.failed?

    @generator = generator
    result = generator.result
    result = build_completed_file(generator.task, result) if @service_file.label == 'completed'
    @result_path = result
  end

  def build_completed_file(task, readable_path)
    generator = KmpdfTool::CompletedFileGenerator.call(task, readable_path)
    raise generator.error if generator.failed?

    completed_path = generator.result
    if task.setting.is_encrypted
      completed_with_password_path = Document::SetPassword.new(completed_path, task.setting.completion_password).call
      return completed_with_password_path
    end

    completed_path
  end
end
