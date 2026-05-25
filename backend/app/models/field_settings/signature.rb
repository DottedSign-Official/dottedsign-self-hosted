module FieldSettings
  class Signature < FieldSetting

    def self.field_value_from_node(field_node)
      field_node.at('image')&.content
    end

    def validate_options
      errors.add(:options, 'invalid placeholder length') if options['placeholder'] && options['placeholder'].length > MAX_LENGTH
    end

    def match_content?(content, valid_signatures: [], **hsh)
      return options['force'] == false if content&.dig(:value).blank?
      signature = content[:type] == 'signature' ? valid_signatures.find_by(id: content[:value].to_i) : GuestSignature.find_by(id: content[:value].to_i)
      return false if signature.nil?
      return signature.photo_file.present? == options['photo'].present?
    end

    protected

    def self.match_by_field_info?(field_info)
      field_info[:field_type] == 'signature'
    end

    def self.match_by_field_node?(field_node)
      field_node.name == 'signature'
    end

  end
end
