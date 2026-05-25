module DigitalCertificator
  class BoxProcess < ServiceCaller
    FORM_FIELD_IMGS_DIR = 'public/form_fields'.freeze

    attr_reader :working_dir

    def initialize(box_type, is_checked, coords, field_size, page_info, working_dir)
      @box_type = box_type
      @is_checked = is_checked
      @coords = coords
      @field_size = field_size
      @page_info = page_info
      @working_dir = working_dir
    end

    def call
      make_box_img
      @result = format_locate_info
    end

    private

    def make_box_img
      @box_image = "#{@working_dir}/box_#{Time.now.to_i}.png"
      origin_box_img = detect_box_img
      new_size = [@field_size[:width], @field_size[:height]].min
      image = MiniMagick::Image.open(origin_box_img) do |loader|
        loader.density(new_size * 100)
      end
      image.combine_options do |opts|
        opts.background("none")
        opts.resize("#{new_size}x#{new_size}")
      end
      image.write(@box_image)
    end

    def detect_box_img
      img_name = @is_checked ? "#{@box_type}-checked.svg" : "#{@box_type}-unchecked.svg"
      "#{FORM_FIELD_IMGS_DIR}/#{img_name}"
    end

    def format_locate_info
      process = ImageProcess.call(@box_image, @coords, @field_size, @page_info)
      raise process.error if process.failed?
      process.result
    end

  end
end
