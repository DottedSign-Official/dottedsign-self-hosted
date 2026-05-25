class ThumbnailMaker < ServiceCaller
  include CommandExecute
  THUMB_MAX_WIDTH  = 175
  THUMB_MAX_HEIGHT = 175
  CONVERT_CMD = "#{Settings.pdf_tool_path} convert -o %{output_filename} %{input_file} %{output_path}".freeze

  attr_reader :working_dir, :service_file

  def initialize(file_id)
    @file_id = file_id
  end

  def call
    obtain_service_file
    source_path = download_processed_file
    thumbnail_path = make_thumbnail(source_path)
    @result = compress_png!(thumbnail_path)
  end

  private

  def obtain_service_file
    @service_file = ServiceFile.find_by_id(@file_id)
    raise ServiceError.new(:file_not_found) if @service_file.nil?
    raise ServiceError.new(:file_not_ready) if @service_file.uploaded_at.nil? || !@service_file.file.attached?
  end

  def download_processed_file
    @working_dir = Settings.working_dir_for(@service_file, create_dir: true)
    downloaded_path = File.join(@working_dir, "source.pdf")
    @service_file.download_to_local(downloaded_path)
    downloaded_path
  end

  def make_thumbnail(file_path)
    output_filename = 'thumbnail'
    run_convert!(file_path, output_filename)
    first_png = first_thumbnail_png(output_filename)
    raise ServiceError.new(:thumbnail_failed) if first_png.blank?
    first_png
  end

  def compress_png!(path)
    image = MiniMagick::Image.open(path)
    image.resize "#{THUMB_MAX_WIDTH}x#{THUMB_MAX_HEIGHT}>"
    image.strip
    image.colors 256
    image.define "png:compression-level=9"
    image.define "png:compression-filter=5"
    image.define "png:compression-strategy=1"
    image.write(path)
    path
  end

  def run_convert!(input_path, output_filename)
    convert_cmd = CONVERT_CMD % {
      output_filename: output_filename,
      input_file: input_path,
      output_path: @working_dir
    }
    convert_result = execute_system_cmd(convert_cmd)
    raise ServiceError.new(:thumbnail_failed) if command_failed?(convert_result)
  end

  def first_thumbnail_png(output_filename)
    img_prefix = File.join(Rails.root, @working_dir, output_filename)
    Dir.glob("#{img_prefix}*.png")
       .sort_by { |img| thumbnail_index(img, img_prefix) }
       .first
  end

  def thumbnail_index(img, img_prefix)
    index = img.sub(img_prefix, '').scan(/\d+/)[0]
    index ? index.to_i : 0
  end


end
