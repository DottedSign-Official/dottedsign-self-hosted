class ImageConvert < ServiceCaller
  CONVERTED_IMG = ['SVG', 'JPG', 'JPEG'].freeze
  CONVERTED_MAX_RETRIES = 3
  attr_reader :working_dir

  def initialize(base64_content, working_dir=nil)
    @working_dir ||= Rails.root.join('tmp', 'sign_tasks', "signature_#{DateTime.now.strftime('%Q')}")
    @base64_content = base64_content
    @source_path = "#{@working_dir}/source"
    @target_path = "#{@working_dir}/target.png"
  end

  def call
    obtain_source_image
    convert_image
    @result = @base64_content
  ensure
    clean_file
  end

  private

  def obtain_source_image
    FileUtils.mkdir_p(@working_dir)
    File.open(@source_path, 'wb+') do |source_file|
      source_file.write(Base64.decode64(@base64_content))
    end
    @source_image = MiniMagick::Image.open(@source_path)
  end

  def convert_image
    return if @source_image.type == 'PNG'
    raise ServiceError.new(:signature_not_convertible) if CONVERTED_IMG.exclude?(@source_image.type)
    convert_source_image
    @base64_content = Base64.encode64(File.read(@target_path))
  end

  def convert_source_image(retries: 0)
    raise 'Image conversion retry failed' if retries >= CONVERTED_MAX_RETRIES
    image = MiniMagick::Image.open(@source_path)
    image.background("none")
    image.format("png")
    image.write(@target_path)
  rescue MiniMagick::Invalid
    convert_source_image(retries: retries + 1)
  end

  def clean_file
    FileUtils.rm_rf(@working_dir)
  end
end
