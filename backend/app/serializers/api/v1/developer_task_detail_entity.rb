class Api::V1::DeveloperTaskDetailEntity < BaseEntity
  expose :task_detail, merge: true


  alias :task :object

  def task_detail
    detail = task.health_check_display
    detail[:report] = task.health_check_report
    detail[:ca_status] = check_ca_status(task)
    detail
  end

  private

  # This method will be n+1 issues, and we will optimize them in the future."
  def check_ca_status(task)
    return 'not_need' unless task.digit_cert_on_stage? || task.visible_ca_on_stage? || task.setting_info['need_ca']
    service_files_id = service_files_id_from_task(task)
    loop_retry_length = GeneralWorker::FAIL_RETRY_IN.length + 1
    return 'failed' if task.stages.where(status: SignStage.statuses[:processing_file_failed]).present?
    failed_ca = CaRetry.where(service_file_id: service_files_id, status: :retry_failed).order(id: :desc).last
    return 'success' unless failed_ca.present?
    failed_ca.retry_count % loop_retry_length == 0 ? 'failed' : 'ca_fail_retrying'
  end

  def service_files_id_from_task(task)
    service_files_id = task.service_files.pluck(:id)
    task.stages.each do |stage|
      service_files_id << stage.service_files.pluck(:id)
    end
    service_files_id
  end
end
