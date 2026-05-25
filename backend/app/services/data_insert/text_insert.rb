class DataInsert
  class TextInsert < ServiceCaller

    def initialize(field_xml, sign_data)
      @field_xml = field_xml
      @value = sign_data['value'] || ''
      @font_size = sign_data['font_size']
      @alignment = sign_data['alignment']
    end

    def call
      @result = insert_to_xfdf
    end

    private

    def insert_to_xfdf
      insert_text
      update_font_size if @font_size
      update_alignment if @alignment
    end

    def insert_text
      @field_xml.at('value')&.remove
      @field_xml.at('defaultappearance').add_next_sibling("<value>#{@value}</value>")
    end

    def update_font_size
      @field_xml.at('defaultappearance').content = @field_xml.at('defaultappearance').content.gsub(/\d+ Tf$/, "#{@font_size} Tf")
    end

    def update_alignment
      alignment_map = {
        'left' => 'left',
        'center' => 'centered',
        'right' => 'right'
      }
      @field_xml['justification'] = alignment_map[@alignment]
    end
  end
end
