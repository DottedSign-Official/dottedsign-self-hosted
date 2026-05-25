module DigitalCertificator
  class ImageProcess < ServiceCaller

    def initialize(image_path, coords, field_size, page_info)
      @image_path = image_path
      @coords = coords
      @field_size = field_size
      @page_info = page_info
    end

    def call
      calculate_image_zoom
      transform_coords
      center_image_in_field
      @result = {
        page: @page_info[:page],
        coord_x: @coord_x,
        coord_y: @coord_y,
        zoom: @zoom,
        path: @image_path
      }
    end

    private

    def calculate_image_zoom
      image = MiniMagick::Image.open(@image_path)
      @image_width = image.width.to_f
      @image_height = image.height.to_f

      if @image_width > @field_size[:width] || @image_height > @field_size[:height]
        @zoom = [(@field_size[:width] - @image_width) * 100 / @image_width, (@field_size[:height] - @image_height) * 100 / @image_height].min
      else
        @zoom = 0
      end
    end

    def transform_coords
      # @coords[left_bottom_x, left_bottom_y, right_top_x, right_top_y]
      # Our coordinate system: origin at bottom-left, positive right and up
      # For visible_cert API: origin at top-left, positive right and down
      case @page_info[:rotate]
      when 90, -270
        @coord_x = @coords[1]
        @coord_y = @coords[0]
      when 270, -90
        @coord_x = @page_info[:height] - @coords[3]
        @coord_y = @page_info[:width] - @coords[2]
      when 180, -180
        @coord_x = @page_info[:width] - @coords[2]
        @coord_y = @coords[1]
      else
        @coord_x = @coords[0]
        @coord_y = @page_info[:height] - @coords[3]
      end
    end

    def center_image_in_field
      # Calculate the actual image dimensions after scaling
      scale_factor = 1 + (@zoom / 100.0)
      scaled_image_width = @image_width * scale_factor
      scaled_image_height = @image_height * scale_factor

      # Find the center point of the field area
      field_center_x = @coord_x + (@field_size[:width] / 2.0)
      field_center_y = @coord_y + (@field_size[:height] / 2.0)

      # Calculate the top-left corner coordinates to center the image within the field
      # Subtract half of the image dimensions from the field center
      @coord_x = field_center_x - (scaled_image_width / 2.0)
      @coord_y = field_center_y - (scaled_image_height / 2.0)
    end

  end
end
