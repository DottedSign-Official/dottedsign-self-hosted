class WatermarkApplyWorker
  include Sidekiq::Worker

  def perform(task_id, mark_type)
    apply_service = KmpdfTool::WatermarkApply.call(task_id, mark_type)
    raise apply_service.error if apply_service.failed?

    task = apply_service.sign_task
    # backup the original file for resending expired task
    task.original_file.copy_to(task, 'pristine_original', skip_callback: true)
    task.upload_service_file('original', io: File.open(apply_service.result), content_type: 'application/pdf', filename: 'file.pdf')
  ensure
    FileUtils.rm_rf(apply_service.working_dir) if apply_service.working_dir.present?
  end
end
