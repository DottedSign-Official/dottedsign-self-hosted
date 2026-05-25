class DataInsert
  class ImageTimestamp < ServiceCaller

    TIMESTAMP_COLOR = '#586af2'.freeze
    TIMESTAMP_SIZE = 24.freeze
    TIMESTAMP_FONT = Settings.pdf_font.path.freeze
    TIMESTAMP_HEIGHT = 65.freeze
    TIMESTAMP_LINE_HEIGHT = 48.freeze
    TIMESTAMP_LINE_BLANK_WIDTH = 165.freeze
    IMAGE_RESIZE_WIDTH = 400.0.freeze

    def initialize(imageable, formatted_time_string, working_dir: "tmp/image_timestamp/#{SecureRandom.hex(10)}")
      @imageable = imageable
      @formatted_time_string = formatted_time_string
      @working_dir = working_dir
      FileUtils.mkdir_p(@working_dir)
    end

    def call
      setup_mini_magick_image
      resize_mini_magick_image
      merge_formatted_time_string
      @result = save
    end

    private

    def setup_mini_magick_image
      file_path = "#{@working_dir}/#{@imageable.raw_file.file.blob.filename}"
      @imageable.raw_file.download_to_local(file_path)
      @mini_magick_image = MiniMagick::Image.open(file_path)
    end

    def resize_mini_magick_image
      # resize image to make timestamp fit
      scale = IMAGE_RESIZE_WIDTH / @mini_magick_image.width
      height = @mini_magick_image.height * scale
      @mini_magick_image.resize("#{IMAGE_RESIZE_WIDTH}x#{height}")
    end

    def merge_formatted_time_string
      # append empty transparent space below the image
      @mini_magick_image.combine_options do |image|
        image.gravity 'North'
        image.extent "#{@mini_magick_image.width}x#{@mini_magick_image.height + TIMESTAMP_HEIGHT}"
        image.background 'none'
      end

      # append formatted time string below the image
      @mini_magick_image.combine_options do |image|
        image.gravity 'South'
        image.pointsize TIMESTAMP_SIZE
        image.fill TIMESTAMP_COLOR
        image.annotate '+0+0', "by DottedSign\n#{@formatted_time_string}"
        image.font TIMESTAMP_FONT
      end

      # draw two lines in the left & right of the formatted time string
      line_height = @mini_magick_image.height - TIMESTAMP_LINE_HEIGHT
      left_line_end = (@mini_magick_image.width - TIMESTAMP_LINE_BLANK_WIDTH) / 2
      right_line_start = (@mini_magick_image.width + TIMESTAMP_LINE_BLANK_WIDTH) / 2
      @mini_magick_image.combine_options do |image|
        image.gravity 'South'
        image.stroke TIMESTAMP_COLOR
        image.strokewidth 1
        image.draw "line 0,#{line_height} #{left_line_end},#{line_height}"
        image.draw "line #{right_line_start},#{line_height} #{@mini_magick_image.width},#{line_height}"
      end
    end

    def save
      file_path = "#{@working_dir}/#{@imageable.id}_timestamp.png"
      @mini_magick_image.write(file_path)
      file_path
    end
  end
end
