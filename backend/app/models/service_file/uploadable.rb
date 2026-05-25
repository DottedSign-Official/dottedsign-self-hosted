class ServiceFile
  module Uploadable
    extend ActiveSupport::Concern

    class_methods do

      def retrieve_from_code(upload_code)
        jwt_code = Base64.urlsafe_decode64(upload_code)
        upload_info, _ = JWT.decode(jwt_code, Secrets.jwt.secret, true, { algorithm: Secrets.jwt.encode_algorithm })
        ServiceFile.find_by_id(upload_info['service_file_id'])
      rescue
      end

    end

    def uploaded?
      uploaded_at.present?
    end

    def upload(*args, **keywords)
      uploaded_at = keywords.delete(:uploaded_at)
      upload_code = keywords.delete(:upload_code)
      skip_callback = keywords.delete(:skip_callback)
      force_upload = keywords.delete(:force_upload)
      options = keywords.delete(:callback_options)

      self.uploaded_at = uploaded_at || Time.zone.now
      if force_upload
        self.file = ActiveStorage::Blob.create_and_upload!(*args, **keywords)
        save!
      else
        file.attach(*args, **keywords)
        return false unless file.attached?
        return false unless save
      end
      UploadFileProcessWorker.perform_async(id, upload_code, options) unless skip_callback
      true
    end

    def force_upload_thumbnail(*args, **keywords)
      self.uploaded_at = uploaded_at || Time.zone.now
      self.thumbnail = ActiveStorage::Blob.create_and_upload!(*args, **keywords)
      save!
    end

    def upload_code
      upload_info = {service_file_id: id, expired_at: 2.days.after.to_i}
      jwt_code = JWT.encode(upload_info, Secrets.jwt.secret, Secrets.jwt.encode_algorithm)
      Base64.urlsafe_encode64(jwt_code) # because url treat '.' as format
    end

    def upload_link
      Rails.application.routes.url_helpers.api_v1_files_upload_url(host: Settings.host, code: upload_code)
    end

  end
end
