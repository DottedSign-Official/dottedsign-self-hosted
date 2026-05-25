module PublicForms
  class Compress < ServiceCaller
    attr_reader :form

    def initialize(form_id)
      @form_id = form_id
    end

    def call
      @form = PublicForm.find_by(id: @form_id)
      raise ServiceError.new(:form_not_found) unless @form.present?

      unless @form.recompressed_file?
        download_info = @form.compress_file.download
        @result={download_info: download_info}
        return @result
      end

      download_info = compressed_file
      @result={download_info: download_info}
    end

    private

    def compressed_file
      @zip_file_path = "#{Rails.root}/tmp/form_#{@form.id}.zip"
      files = @form.task_files_for_label('completed')
      file_name = "#{@form.form_name}.zip"
      
      FileUtils::ZipHelper.create_zip_file('file', @zip_file_path, files)
      @form.upload(@zip_file_path, content_type: 'application/zip', filename: file_name)
      
      {
        content: File.read(@zip_file_path),
        content_type: 'application/zip',
        file_name: file_name,
        size: File.size(@zip_file_path)
      }
    rescue => e
      raise ServiceError.new(:file_compress_failed, e.message)
    ensure
      File.delete(@zip_file_path) if @zip_file_path && File.exist?(@zip_file_path)
    end
  end
end