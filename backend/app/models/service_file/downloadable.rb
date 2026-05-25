require 'zip'

class ServiceFile
  module Downloadable
    extend ActiveSupport::Concern

    def download(attach_type = 'file')
      case storable
      when Envelope
        envelope_download_info(attach_type)
      else
        normal_file_download_info(attach_type)
      end
    end

    def download_code(will_expired: true)
      download_info = { service_file_id: id, timestamp: Time.now.to_i }
      download_info[:exp] = 2.days.after.to_i if will_expired
      jwt_code = JWT.encode(download_info, Secrets.jwt.secret, Secrets.jwt.encode_algorithm)
      Base64.urlsafe_encode64(jwt_code) # because url treat '.' as format
    end

    def download_path(attach_type: 'file', will_expired: true)
      Rails.application.routes.url_helpers.api_v1_files_download_path(code: download_code(will_expired: will_expired), attach_type: attach_type)
    end

    def download_link(attach_type: 'file', will_expired: true)
      Rails.application.routes.url_helpers.api_v1_files_download_url(host: Settings.host, code: download_code(will_expired: will_expired), attach_type: attach_type)
    end

    def internal_download_link(attach_type: 'file', will_expired: true)
      Rails.application.routes.url_helpers.api_internal_files_download_url(host: Settings.host, code: download_code(will_expired: will_expired), attach_type: attach_type)
    end

    def download_to_local(file_path)
      return unless file.attached?
      content = file.download
      File.open(file_path, 'wb+') do |file|
        file.write(content)
      end
      file_path
    end

    def download_base64(attach_type = 'file')
      attach_item = send(attach_type)
      raise ServiceError.new(:file_not_ready) unless attach_item.attached?
      Base64.strict_encode64(attach_item.download)
    end

    private

    def envelope_download_info(attach_type = 'file')
      case label
      when /^reference_file_/, /^completed_reference_file_/
        # Reference files are not compressed
        normal_file_download_info(attach_type)
      else
        compressed_file_download_info(attach_type)
      end
    end

    def normal_file_download_info(attach_type = 'file')
      attach_item = send(attach_type)
      raise ServiceError.new(:file_not_ready) unless attach_item.attached?
      
      content_type = attach_item.blob.content_type
      extension = Rack::Mime::MIME_TYPES.invert[content_type]
      {
        content: attach_item.download,
        content_type: content_type,
        file_name: "#{file_name}#{extension}",
        size: attach_item.blob.byte_size
      }
    end

    def compressed_file_download_info(attach_type = 'file')
      @zip_file_path = "#{Rails.root}/tmp/envelope_#{storable.id}_#{label}.zip"
      create_zip_file(attach_type, @zip_file_path)
      {
        content: File.read(@zip_file_path),
        content_type: 'application/zip;charset=utf-8',
        file_name: "#{file_name}_#{label}.zip",
        size: File.size(@zip_file_path)
      }
    ensure
      File.delete(@zip_file_path) if @zip_file_path && File.exist?(@zip_file_path)
    end

    def create_zip_file(attach_type, zip_file_path)
      file_name_count = {}

      Zip.unicode_names = true
      Zip::File.open(zip_file_path, Zip::File::CREATE) do |zipfile|
        storable.task_files_for_label(label).includes(file_attachment: :blob).each do |target_file|
          file_name, file_content = setup_file_info(attach_type, target_file, file_name_count)
          zipfile.get_output_stream(file_name.force_encoding('utf-8')) { |f| f.write(file_content) }
        end
      end
    end

    def setup_file_info(attach_type, target_file, file_name_count)
      attach_item = target_file.send(attach_type)
      raise ServiceError.new(:file_not_ready) unless attach_item.attached?

      file_content = attach_item.download
      content_type = attach_item.blob.content_type
      extension = Rack::Mime::MIME_TYPES.invert[content_type]
      file_name = label == 'audit_trail' ? "#{target_file.file_name}_AuditTrail" : target_file.file_name

      if file_name_count[file_name]
        file_name_count[file_name] += 1
        file_name = "#{file_name} (#{file_name_count[file_name]})#{extension}"
      else
        file_name_count[file_name] = 1
        file_name = "#{file_name}#{extension}"
      end

      return file_name, file_content
    end
  end
end
