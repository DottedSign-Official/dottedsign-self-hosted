class MissionTasksCompressWorker < GeneralWorker
  sidekiq_options queue: :low

  def perform(mission_id)
    mission = BulkMission.find_by_id(mission_id)
    return if mission.nil?
    return unless mission.all_task_finished?
    compress = TaskCompressor.call(mission.completed_tasks.pluck(:id))
    raise compress.error if compress.failed?
    zip_file = compress.result

    mission.upload_service_file('compress', io: File.open(zip_file), content_type: 'application/zip', filename: 'file.zip')
  ensure
    FileUtils.rm_rf(compress.working_dir) if compress.working_dir.present?
  end

end
