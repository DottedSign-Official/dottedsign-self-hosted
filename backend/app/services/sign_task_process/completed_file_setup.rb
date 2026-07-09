class SignTaskProcess::CompletedFileSetup < ServiceCaller
  def initialize(task)
    @task = task
  end

  def call
    file = ServiceFile.setup_for(@task, 'completed')
    ReadableFileGeneratorWorker.perform_async(file.id, @task.setting_info['need_ca'])
  end
end
