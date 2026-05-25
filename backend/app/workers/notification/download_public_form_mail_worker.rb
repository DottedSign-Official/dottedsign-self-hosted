module Notification
  class DownloadPublicFormMailWorker < GeneralWorker

    def perform(form_id)
      form = PublicForm.find_by(id: form_id)
      return unless form.present?

      owner = form.owner
      lang = owner.profile&.language || 'en'
      email = owner.email
      form_name = form.form_name
      compress_file = form.compress_file
      download_link = compress_file.download_link
      MailCenter.delay.raise_if_server_failed('public_form_compress_download', email, form_name, download_link, lang)
    end

  end
end
