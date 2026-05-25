module Notification
  class BackupMailWorker < GeneralWorker
    def perform(email, user_name, file_name, service_file_id)
      file = ServiceFile.find_by(id: service_file_id)
      link = file.download_link
      raise 'no file download link' if link.nil?
      MailCenter.delay.raise_if_server_failed('document_backup', email, user_name, file_name, file.preview_code(will_expired: false, default_member_email: email), link, file.file_size)
    end
  end
end
