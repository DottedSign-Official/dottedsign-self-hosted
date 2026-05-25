class AuditTrailGenerateWorker < GeneralWorker

  def perform(task_id, options = {})
    task = SignTask.find_by_id(task_id)
    return unless task.present? && task.finished?

    I18n.locale = audit_trail_lang(task)
    pdf = prepare_audit_pdf(task)
    audit_dir = Settings.working_dir_for(task, create_dir: true)
    audit_trail = write_pdf_to_file(pdf, audit_dir)
    file_name = need_digital_certificate?(options) ? digit_sign_audit_trail(audit_trail, task) : audit_trail

    task.upload_service_file('audit_trail', io: File.open(file_name), content_type: 'application/pdf', filename: 'file.pdf', callback_options: options)
    pdf
  ensure
    FileUtils.rm_rf(audit_dir) if audit_dir.present?
  end

  private

  def audit_trail_lang(task)
    owner_lang = task.owner.profile.language
    SignTask::AVAILABLE_AUDIT_LANGS.include?(owner_lang) ? owner_lang : Settings.default.profile.language
  end

  def prepare_audit_pdf(task)
    content = task.audit_trails_pdf_info
    template_name = Settings.pdf_font_folder.enable ? 'audit_trails_pdf_with_custom_font' : 'audit_trails_pdf'
    WickedPdf.new.pdf_from_string(
      ActionController::Base.new.render_to_string("templates/#{template_name}", assigns: { content: content })
    )
  end

  def write_pdf_to_file(pdf, audit_dir)
    file_name = "#{audit_dir}/audit.pdf"
    File.open(file_name, 'wb+') { |f| f.write(pdf) }
    file_name
  end

  def need_digital_certificate?(options)
    options.delete('need_digital_certificate') || false
  end

  def digit_sign_audit_trail(audit_trail, task)
    cert_info = { long_id: task.long_id }
    log_info = { file_type: 'audit_trail', task_id: task.id }
    dc_service = DigitalCertificator::PdfSign.call(audit_trail, cert_info: cert_info, log_info: log_info)
    raise dc_service.error if dc_service.failed?
    dc_service.result
  end

end
