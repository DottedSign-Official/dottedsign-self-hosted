class ReadableFileGeneratorWorker < GeneralWorker

  def perform(file_id, need_digital_certificate = false)
    service_file = ServiceFile.find_by_id(file_id)
    raise "file not found" if service_file.nil?

    ids = obtain_ids_from_service_file(service_file)
    raise "ids not found" if ids.blank?

    reschedule_interval_times = other_stage_file_processing_num(file_id, ids, need_digital_certificate)
    if reschedule_interval_times > 0
      do_reschedule(file_id, need_digital_certificate, reschedule_interval_times)
      return
    end

    generator = KmpdfTool::ReadableFileGenerator.call(ids[:task_id], ids[:stage_id])
    raise generator.error if generator.failed?

    task = generator.task
    readable_file = generator.result
    if service_file.label == 'completed'
      readable_file = process_completed_file(task, readable_file, need_digital_certificate)
    elsif /stage_\d+/.match?(service_file.label)
      readable_file = process_stage_file(task, service_file, readable_file, need_digital_certificate)

      # Directly return if processing stage file ca failed and not retryable
      return if service_file.storable.processing_file_failed?
    end

    service_file.upload(io: File.open(readable_file), content_type: 'application/pdf', filename: 'file.pdf')
    ca_retry = CaRetry.find_by(service_file_id: file_id)
    ca_retry.retry_succeed! if ca_retry.present?
  rescue => e
    ca_retry = CaRetry.find_or_create_by(service_file_id: file_id)
    loop_retry_length = GeneralWorker::FAIL_RETRY_IN.length + 1
    error_message = e.respond_to?(:error_obj) ? e.error_obj&.dig(:error_msg) : e.message
    if ca_retry.retry_count % loop_retry_length == 0 && ca_retry.retry_count != 0
      service_file.storable.processing_file_failed! if service_file.storable.respond_to?(:processing_file_failed!)
      MailCenter.delay.raise_if_server_failed('system_ca_fail_notify', SuperAdmin, ids[:task_id], ids[:stage_id], error_message)
    end
    ca_retry.add_retry_count(error_message)
    raise e
  ensure
    FileUtils.rm_rf(generator.working_dir) if generator&.working_dir.present?
  end

  private

  def obtain_ids_from_service_file(service_file)
    case service_file.storable_type
    when 'SignTask'
      {
        task_id: service_file.storable_id
      }
    when 'SignStage'
      {
        task_id: service_file.storable.sign_task_id,
        stage_id: service_file.storable_id
      }
    when 'DummyStage'
      if service_file.storable.source_type == 'SignTask'
        {
          task_id: service_file.storable.source_id,
          stage_id: service_file.storable_id
        }
      end
    end
  end

  def process_completed_file(task, readable_path, need_digital_certificate = false)
    generator = CompletedFileGenerator.call(task, readable_path)
    raise generator.error if generator.failed?
    readable_path = generator.result

    if need_digital_certificate && SYSTEM_CA_USE
      cert_info = { long_id: task.long_id }
      log_info = { file_type: 'task', task_id: task.id }
      dc_service = DigitalCertificator::PdfSign.call(readable_path, cert_info: cert_info, log_info: log_info)
      raise dc_service.error if dc_service.failed?
      readable_path = dc_service.result
    end

    readable_path
  end

  def process_stage_file(task, external_file, readable_path, need_digital_certificate = false)

    if need_digital_certificate
      stage = external_file.storable
      stage_base_class_name = stage.class.base_class.name
      generator = KmpdfTool::PdfAnnotateGenerator.call(stage.field_settings, readable_path, incremental_update: true)
      readable_path = generator.result if generator.success?

      dc_service = nil
      cert_info = DigitalCertificate::Gra.get_system_ap_info(task_id: task.id)
      cert_type = 'ap_cert'
      log_info = { file_type: 'stage', task_id: task.id, stage_type: stage_base_class_name, stage_id: stage.id }
      system_ca = nil

      if stage.use_personal_cert? || stage.use_company_cert?
        cert_info = {
          long_id: task.long_id,
          email: stage.action_form_sign? ? stage.actor_info['email'] : stage.email,
          tid: task.in_envelope? ? Rails.cache.read("envelope:#{task.envelope_id}:tid") : Rails.cache.read("#{stage_base_class_name}:#{stage.id}:tid"),
          path_version: task.in_envelope? ? 'v2' : 'v1'
        }
        cert_type = 'user_cert'
      elsif stage.use_system_cert?
        system_cert_verify_info = stage.obtain_system_cert_verify_info
        if system_cert_verify_info.verify_source.present?
          system_ca = stage.actor.system_cas.find_by(id: system_cert_verify_info.verify_source.to_i)
        end
      end

      if stage.is_visible_ca?
        dc_service = DigitalCertificator::FieldSign.call(readable_path, stage.xfdf_document.id, stage.visible_ca_field_object_id, custom_cert: true, system_ca: system_ca, cert_info: cert_info, cert_type: cert_type, log_info: log_info)
      elsif stage.use_system_cert? || stage.use_personal_cert? || stage.use_company_cert?
        dc_service = DigitalCertificator::PdfSign.call(readable_path, custom_cert: true, cert_type: cert_type, cert_info: cert_info, log_info: log_info)
      end

      # Directly return (not triggering raise) if processing stage file ca failed and not retryable
      return stage.processing_file_failed! if dc_service&.failed? && stage.ca_not_retryable?
        
      raise dc_service.error if dc_service&.failed?
      readable_path = dc_service.result if dc_service&.result.present?
    end

    readable_path
  end

  def other_stage_file_processing_num(file_id, ids, need_digital_certificate)
    SignTask.find_by_id(ids[:task_id]).stages.with_signers.processing_file
      .where.not(id: ids[:stage_id])
      .where("id < ?", ids[:stage_id]) # Only count stages before current stage to avoid all stages reschedule at the same time
      .size
  end

  def do_reschedule(file_id, need_digital_certificate, interval_times = 1)
    ReadableFileGeneratorWorker.perform_in(SignTask::GEN_FILE_RETRY_DURATION * interval_times, file_id, need_digital_certificate)
  end
end
