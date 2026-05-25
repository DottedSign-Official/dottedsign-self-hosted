module DigitalCertificator
  class TextProcess < ServiceCaller
    attr_reader :working_dir

    def initialize(text, is_date, coords, field_size, page_info, working_dir)
      @text = text
      @is_date = is_date
      @coords = coords
      @field_size = field_size
      @page_info = page_info
      @working_dir = working_dir
    end

    def call
      make_text_img
      @result = format_locate_info
    end

    private

    def make_text_img
      @text_image = "#{@working_dir}/text_#{Time.now.to_i}.png"
      gravity = @is_date ? 'west' : 'northwest'
      image = MiniMagick::Image.open("caption: #{@text}") do |loader|
        loader.background("none")
        loader.gravity gravity
        loader.size "#{@field_size[:width]}x#{@field_size[:height]}"
        loader.pointsize 14
        loader.font Settings.pdf_font.path
      end
      image.write(@text_image)
    end

    def format_locate_info
      process = ImageProcess.call(@text_image, @coords, @field_size, @page_info)
      raise process.error if process.failed?
      process.result
    end

  end
end
