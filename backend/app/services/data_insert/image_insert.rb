class DataInsert
  class ImageInsert < ServiceCaller

    def initialize(field_xml, raw_image)
      @field_xml = field_xml
      @raw_image = raw_image
    end

    def call
      if @raw_image.nil?
        clear_image
      else
        convert_to_hex
        @result = insert_to_xfdf
      end
    end

    private

    def convert_to_hex
      @hex_string = @raw_image.unpack('H*').first
    end

    def insert_to_xfdf
      @field_xml.at('image').content = @hex_string
      @field_xml.attribute('signed').value = 'true'
    end

    def clear_image
      @field_xml.at('image').content = ''
      @field_xml.attribute('signed').value = 'false'
    end
  end
end
