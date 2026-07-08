module DigitalCertificator
  class ServiceFileSign < ServiceCaller
    def initialize(service_file, ids, readable_path: nil)
      @service_file = service_file
      @ids = ids
      @readable_path = readable_path
    end

    def call
      task = SignTask.find_by_id(@ids[:task_id])

      with_source_path do |source_path|
        signed_path = apply_ca(task, source_path)
        next if signed_path.nil?

        @service_file.upload(io: File.open(signed_path), content_type: 'application/pdf', filename: 'file.pdf')
        @result = true
      end

      ca_retry = CaRetry.find_by(service_file_id: @service_file.id)
      ca_retry.retry_succeed! if @result && ca_retry.present?
    rescue StandardError => e
      ca_retry = CaRetry.find_or_create_by(service_file_id: @service_file.id)
      loop_retry_length = GeneralWorker::FAIL_RETRY_IN.length + 1
      error_message = e.respond_to?(:error_obj) ? e.error_obj&.dig(:error_msg) : e.message
      if (ca_retry.retry_count % loop_retry_length).zero? && ca_retry.retry_count != 0
        storable = @service_file.storable
        storable.processing_file_failed! if storable&.respond_to?(:processing_file_failed!)
        MailCenter.delay.raise_if_server_failed(
          'system_ca_fail_notify', SuperAdmin,
          @ids&.dig(:task_id), @ids&.dig(:stage_id), error_message
        )
      end
      ca_retry.add_retry_count(error_message)
      raise
    end

    private

    def with_source_path
      if @readable_path
        yield @readable_path
      else
        Tempfile.create(['ca_sign', '.pdf']) do |tempfile|
          tempfile.binmode
          tempfile.write(@service_file.file_content)
          tempfile.flush
          yield tempfile.path
        end
      end
    end

    def apply_ca(task, signed_path)
      if @service_file.label == 'completed'
        apply_completed_ca(task, signed_path)
      elsif /stage_\d+/.match?(@service_file.label)
        result = apply_stage_ca(task, @service_file, signed_path)
        return nil if @service_file.storable.processing_file_failed?
        result
      else
        signed_path
      end
    end

    def apply_completed_ca(task, readable_path)
      return readable_path unless SYSTEM_CA_USE
      cert_type = "system_cert"
      cert_info = { long_id: task.long_id, password: task.setting.completion_password }
      log_info = { file_type: 'task', task_id: task.id }
      dc_service = PdfSign.call(readable_path, cert_type:cert_type, cert_info: cert_info, log_info: log_info)
      raise dc_service.error if dc_service.failed?
      dc_service.result
    end

    def apply_stage_ca(task, external_file, readable_path)
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
        dc_service = FieldSign.call(readable_path, stage.xfdf_document.id, stage.visible_ca_field_object_id, custom_cert: true, system_ca: system_ca, cert_info: cert_info, cert_type: cert_type, log_info: log_info)
      elsif stage.use_system_cert? || stage.use_personal_cert? || stage.use_company_cert?
        dc_service = PdfSign.call(readable_path, custom_cert: true, cert_type: cert_type, cert_info: cert_info, log_info: log_info)
      end

      return stage.processing_file_failed! if dc_service&.failed? && stage.ca_not_retryable?
      raise dc_service.error if dc_service&.failed?
      readable_path = dc_service.result if dc_service&.result.present?
      readable_path
    end
  end
end
