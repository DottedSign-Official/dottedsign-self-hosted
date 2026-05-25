class Signature
  module Storable
    extend ActiveSupport::Concern

    include ShareStorable

    included do
      has_many :service_files, as: :storable, dependent: :destroy
      has_many :uploaded_files, -> { uploaded }, as: :storable, class_name: 'ServiceFile'
    end

    def raw_file
      uploaded_files.find_by(label: 'signature_raw')
    end

    def video_file
      uploaded_files.find_by(label: 'signature_video')
    end

    def photo_file
      uploaded_files.find_by(label: 'signature_photo')
    end

    def stroke_file
      uploaded_files.find_by(label: 'signature_stroke')
    end

    def signature_raw
      raw_file.file_content.force_encoding(Encoding::UTF_8)
    end
  
    def raw_file_base64
      Base64.strict_encode64(signature_raw)
    end

    def upload_media_file(label, io, content_type, filename, skip_callback: false)
      attach_success = upload_service_file(label, io: io, content_type: content_type, filename: filename, skip_callback: skip_callback)
      raise ServiceError.new(:file_not_ready) unless attach_success
    end
  end
end
