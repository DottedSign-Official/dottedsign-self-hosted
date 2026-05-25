class Image
  module Storable
    extend ActiveSupport::Concern

    include ShareStorable

    included do
      has_one :raw_file, as: :storable, class_name: 'ServiceFile'

      scope :with_attached_file, -> { includes(raw_file: { file_attachment: :blob }) }
    end

    def image_raw
      raw_file.file_content.force_encoding(Encoding::UTF_8)
    end

    def raw_file_base64
      Base64.strict_encode64(image_raw)
    end
  end
end
