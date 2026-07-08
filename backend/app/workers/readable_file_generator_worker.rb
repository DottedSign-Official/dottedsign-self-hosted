class ReadableFileGeneratorWorker < GeneralWorker
  include ServiceFileProcessable

  def perform(file_id, need_digital_certificate = false)
    processor = nil

    service_file = ServiceFile.find_by_id(file_id)
    raise 'file not found' if service_file.nil?

    ids = obtain_ids_from_service_file(service_file)
    raise 'ids not found' if ids.blank?

    reschedule_interval_times = other_stage_file_processing_num(file_id, ids, need_digital_certificate)
    if reschedule_interval_times > 0
      do_reschedule(file_id, need_digital_certificate, reschedule_interval_times)
      return
    end

    processor = SignTaskProcess::ReadableFileProcessor.call(service_file, ids)
    raise processor.error if processor.failed?

    if need_digital_certificate
      signer = DigitalCertificator::ServiceFileSign.call(service_file, ids, readable_path: processor.result)
      raise signer.error if signer.failed?
    else
      service_file.upload(io: File.open(processor.result), content_type: 'application/pdf', filename: 'file.pdf')
    end
  ensure
    processor&.cleanup
  end

  private

  def other_stage_file_processing_num(file_id, ids, need_digital_certificate)
    SignTask.find_by_id(ids[:task_id]).stages.with_signers.processing_file
      .where.not(id: ids[:stage_id])
      .where('id < ?', ids[:stage_id])
      .size
  end

  def do_reschedule(file_id, need_digital_certificate, interval_times = 1)
    ReadableFileGeneratorWorker.perform_in(SignTask::GEN_FILE_RETRY_DURATION * interval_times, file_id, need_digital_certificate)
  end
end
