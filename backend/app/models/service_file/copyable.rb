class ServiceFile
  module Copyable

    def copy_to(target, label, skip_callback: false)
      target_file = target.service_files.find_or_initialize_by(label: label)
      if skip_callback
        target_file.upload(file_blob, uploaded_at: uploaded_at, skip_callback: true)
        target_file.thumbnail.attach(thumbnail_blob) if thumbnail_blob.present?
      else
        target_file.upload(file_blob)
      end
    end

  end
end
