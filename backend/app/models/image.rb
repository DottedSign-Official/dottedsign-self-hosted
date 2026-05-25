# frozen_string_literal: true

class Image < ApplicationRecord
  include Storable
  include Convertible

  class << self
    def setup(base64_data)
      raw_data = Base64.decode64(base64_data)
      mini_magick_image ||= MiniMagick::Image.read(raw_data)
      image = nil
      ActiveRecord::Base.transaction do
        image = Image.create
        image.upload_service_file('image_raw', io: StringIO.new(raw_data), content_type: mini_magick_image.mime_type, filename: "file.#{mini_magick_image.type.downcase}", skip_callback: true)
      end
      image
    end
  end
end
