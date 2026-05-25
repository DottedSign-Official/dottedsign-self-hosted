class GuestSignature < ApplicationRecord
  include Convertible
  include Signature::Storable

  scope :photo_category, -> { where(category: 'signature_with_photo') }

  def self.setup(signature_params, sign_video: nil, sign_photo: nil, sign_stroke: nil)
    ActiveRecord::Base.transaction do
      guest_signature = GuestSignature.new(signature_params.except(:raw))
      guest_signature.upload_service_file('signature_raw', io: StringIO.new(Base64.decode64(signature_params[:raw])), content_type: 'image/png', filename: 'signature_raw.png', skip_callback: true)
      guest_signature.upload_media_file('signature_video', StringIO.new(Base64.decode64(sign_video)), 'video/mp4', 'signature_video.mp4') if sign_video.present?
      guest_signature.upload_media_file('signature_photo', StringIO.new(Base64.decode64(sign_photo)), 'image/png', 'signature_photo.png') if sign_photo.present?
      guest_signature.upload_media_file('signature_stroke', StringIO.new(sign_stroke), 'plain/text', 'signature_stroke.txt') if sign_stroke.present?
      guest_signature
    end
  end

  def display
    {
      id: self.id,
      raw: raw_file_base64,
      category: 'guest_signature'
    }
  end

end
