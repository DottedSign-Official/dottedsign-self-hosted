require 'zip'

module FileUtils
  module ZipHelper
    def self.create_zip_file(attach_type, zip_file_path, files = [])
      file_name_count = {}

      Zip.unicode_names = true
      Zip::File.open(zip_file_path, Zip::File::CREATE) do |zipfile|
        files.each do |target_file|
          file_name, file_content = setup_file_info(attach_type, target_file, file_name_count)
          zipfile.get_output_stream(file_name.force_encoding('utf-8')) { |f| f.write(file_content) }
        end
      end
    end

    def self.setup_file_info(attach_type, target_file, file_name_count)
      attach_item = target_file.send(attach_type)
      raise ServiceError.new(:file_not_ready) unless attach_item.attached?

      file_content = attach_item.download
      content_type = attach_item.blob.content_type
      extension = Rack::Mime::MIME_TYPES.invert[content_type]
      file_name  = target_file.file_name

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