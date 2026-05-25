class FileMerge < ServiceCaller
  include CommandExecute

  CONVERT_CMD = "#{Settings.pdf_tool_path} convert -o %{output_filename} %{input_file} %{output_path}".freeze

  attr_reader :working_dir

  def initialize(file_ids, file_infos={}, download_folder='tmp/service_files')
    @file_ids = file_ids
    @file_infos = file_infos
  end

  def call
    setup_objects
    download_files do |merge_file_infos|
      generate_merged_pdf(merge_file_infos)
    end
    @result = @merged_pdf
  end

  private

  def setup_objects
    @files = ServiceFile.uploaded.where(id: @file_ids)
    raise ServiceError.new(:file_not_found) if @files.blank?
  end

  def download_files(&block)
    merge_file_infos = @files.map do |service_file|
      @working_dir ||= Settings.working_dir_for(service_file, create_dir: true)
      info = @file_infos["#{service_file.storable_type}:#{service_file.storable_id}:#{service_file.label}"] || {}
      extension = Rack::Mime::MIME_TYPES.invert[service_file.file_blob.content_type]
      file_path = Rails.root.join("#{@working_dir}/#{service_file.label}#{extension}").to_path
      service_file.download_to_local(file_path)
      info[:files] = extension == '.pdf' ? convert_pdf_to_imgs(file_path) : [{path: file_path, content_type: service_file.file_blob.content_type}]
      info
    end
    yield merge_file_infos
  end

  def convert_pdf_to_imgs(pdf)
    filename = pdf.split('/').last.sub(/.pdf$/, '')
    convert_info = {
      output_filename: filename,
      input_file: pdf,
      output_path: @working_dir
    }
    convert_cmd = CONVERT_CMD % convert_info
    convert_res = execute_system_cmd(convert_cmd)
    return [] if command_failed?(convert_res)
    img_prefix = "#{Rails.root}/#{@working_dir}/#{filename}"
    Dir.glob("#{img_prefix}*.png")
    .sort_by{|img| img.sub(img_prefix, '').scan(/\d+/)[0].to_i}
    .map{|file_path| { path: file_path, content_type: 'image/png' } }
  end

  def generate_merged_pdf(merge_file_infos)
    pdf = WickedPdf.new.pdf_from_string(
      ActionController::Base.new.render_to_string('templates/attachment', assigns: {file_info: merge_file_infos})
    )
    @merged_pdf = "#{@working_dir}/merged.pdf"
    File.open(@merged_pdf, 'wb+') do |file|
      file.write(pdf)
    end
  end
end
