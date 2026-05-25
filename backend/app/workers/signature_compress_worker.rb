class SignatureCompressWorker < GeneralWorker

  def perform(task_id)
    @task = SignTask.find(task_id)
    return if @task.nil?
    @working_dir = Settings.create_cache_working_dir
    FileUtils.mkdir_p(@working_dir)

    setup_signature_files
    return if @signature_file_map.empty?
    compress_signature_files
    upload_compressed_file
  end

  private

  def setup_signature_files
    @signature_file_map = {}
    field_setting_map = @task.field_settings.index_by(&:id)
    file_types = Settings.callback.signature_compress.select { |_, enable| enable }.keys
    [Signature, GuestSignature].each do |signature_class|
      signature_class.photo_category.includes(:uploaded_files).merge(ServiceFile.with_attached_file).where("(other_info->>'task_id')::integer = ?", @task.id).each do |signature|
        file_name_prefix = "task_#{@task.id}_#{field_setting_map[signature.other_info['field_setting_id']].field_object_id}"
        file_types.each do |file_type|
          service_file = signature.send(file_type)
          next unless service_file.present? && service_file.file.present?
          file_extension = service_file.file.blob.filename.extension
          file_name = "#{file_name_prefix}.#{file_extension}"
          File.open("#{@working_dir}/#{file_name}", 'wb') { |file| file.write(service_file.download[:content]) }
          @signature_file_map[file_name] = "#{@working_dir}/#{file_name}"
        end
      end
    end
  end

  def compress_signature_files
    @zip_file = "#{@working_dir}/compress.zip"
    Zip.unicode_names = true
    Zip::File.open(@zip_file, Zip::File::CREATE) do |zipfile|
      @signature_file_map.each do |file_name, file_path|
        zipfile.add(file_name, file_path)
      end
    end
  end

  def upload_compressed_file
    @task.upload_service_file('signature_compressed', io: File.open(@zip_file), content_type: 'application/zip', filename: 'file.zip')
  end
end
