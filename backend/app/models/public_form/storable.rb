class PublicForm
  module Storable
    extend ActiveSupport::Concern
    include ShareStorable

    def compressing?
      false
    end

    def set_compressing(job_id, running = true)
      return unless job_id.present?
      if running
        Rails.cache.write(compressing_cache_key, job_id, expires_in: 1.hour)
      else
        Rails.cache.delete(compressing_cache_key)
      end
    end

    def stage_attachment_files
      all_task_stage_ids = SignStage.joins(:sign_task).where(sign_tasks: { public_form_id: id }).pluck(:id)
      ServiceFile.uploaded.where(storable_type: SignStage.name, storable_id: all_task_stage_ids).where('label LIKE ?', '%attachment_%')
    end

    def task_files_for_label(label)
      if label == 'attachment'
        stage_attachment_files
      else
        all_task_ids = SignTask.where(public_form_id: id).pluck(:id)
        ServiceFile.uploaded.where(storable_type: SignTask.name, storable_id: all_task_ids, label: label)
      end
    end

    def upload(readable_file, content_type: 'application/zip', filename: nil)
      upload_service_file(compress_label, io: File.open(readable_file), content_type: content_type, filename: filename)
    end

    def compress_label
      "compress_form_#{id}"
    end

    def recompressed_file?
      service_file = ServiceFile.find_by(label: compress_label)
      return true unless service_file.present?

      updated_at > service_file.uploaded_at
    end

    def compress_file
      ServiceFile.find_by(label: compress_label)
    end

    private

    def compressing_cache_key
      "form:#{id}:compress"
    end
  end
end