class DataInsert
  class BoxInsert < ServiceCaller

    def initialize(field_xml, box_value)
      @field_xml = field_xml
      @box_value = ActiveRecord::Type::Boolean.new.cast(box_value) ? 'Yes' : 'Off'
    end

    def call
      @result = insert_to_xfdf
    end

    private

    def insert_to_xfdf
      @field_xml.at('value').content = @box_value
    end

  end
end
