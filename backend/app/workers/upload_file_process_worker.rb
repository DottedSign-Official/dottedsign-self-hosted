class UploadFileProcessWorker < GeneralWorker

  def perform(file_id, upload_code = nil, options = {})
    @file = ServiceFile.find_by_id(file_id)
    raise ServiceError.new(:file_not_ready) unless @file.present? && @file.uploaded?
    @storable = @file.storable
    case @file.label
    when 'avatar'
      setup_member_icon
    when 'icon'
      setup_group_icon
    when 'original'
      form_generate
      make_thumbnail
    when 'full'
      full_file_notify
      xfdf_extract
      @file.storable.active! if @file.storable_type == 'Template'
    when 'completed'
      storable_complete
      complete_mail_send
      make_thumbnail
    when 'audit_trail'
      return
    when 'compress'
      storable_complete
    when /^stage_/
      stage_done
    when /^attachment_/, /^dummy_attachment_/
      attachment_file_notify(upload_code)
      make_thumbnail
    when /^reference_/
      reference_notify
    end
  end

  private

  def setup_member_icon
    icon_path = @file.download_path(will_expired: false)
    @storable.profile&.update(icon_url: "%{server_host}#{icon_path}")
  end

  def setup_group_icon
    icon_path = @file.download_path(will_expired: false)
    @storable.update(icon_url: "%{server_host}#{icon_path}")
  end

  def form_generate
    PdfFormGenerateWorker.perform_async(@file.storable_type, @file.storable_id)
  end

  def full_file_notify
    return unless @file.storable_type == 'SignTask'
    return unless @file.storable.sign_type == 'sign_and_send'
    @file.storable.waiting!
  end

  def xfdf_extract
    XfdfExporterWorker.perform_async(@file.storable_type, @file.storable_id)
  end

  def storable_complete
    @storable.do_completed
  end

  def stage_done
    @storable.before_done
  end

  def complete_mail_send
    if @storable.completed?
      Notification::CompletedMailWorker.perform_async(@storable.id)
      Notification::KioskCompletedMailWorker.perform_async(@storable.id) if @storable.kiosk?
    end
  end

  def attachment_file_notify(upload_code)
    socket_payload = { stage_id: @file.storable_id, file_label: @file.label, status: 'success' }
    SocketCenter.broadcast_to_code(upload_code, event: 'file_uploaded', payload: socket_payload)
  end

  def reference_notify
    SocketCenter.broadcast(@storable.owner.id, event: 'reference_uploaded', payload: { task_id: @file.storable_id, file_label: @file.label, status: 'success' })
  end

  def make_thumbnail
    return unless @file.thumbnail_processable?

    ThumbnailMakerWorker.perform_async(@file.id)
  end
end
