class Signature < ApplicationRecord
  belongs_to :member

  scope :signature_category, -> { where(category: ALLOW_SIGNATURE_CATEGORIES) }
  scope :stamp_category, -> { where(category: 'stamp') }
  scope :photo_category, -> { where(category: 'signature_with_photo') }
  scope :category_recent, -> { order(:category, created_at: :desc) }

  ALLOW_FILE_TYPES = %w[png svg jpg jpeg].freeze
  ALLOW_SIGNATURE_CATEGORIES = %w[initial signature].freeze
  ALLOW_CATEGORIES = %w[signature initial stamp signature_with_photo].freeze

  include Convertible
  include Signature::Storable

  class << self

    def setup(member, signature_params, sign_video: nil, sign_photo: nil, sign_stroke: nil)
      signature = nil
      ActiveRecord::Base.transaction do
        signature = member.signatures.create(signature_params.except(:raw))
        signature.upload_media_file('signature_raw', StringIO.new(Base64.decode64(signature_params[:raw])), "image/#{signature_params[:file_type]}", "signature_raw.#{signature_params[:file_type]}", skip_callback: true)
        signature.upload_media_file('signature_video', StringIO.new(Base64.decode64(sign_video)), 'video/mp4', 'signature_video.mp4') if sign_video.present?
        signature.upload_media_file('signature_photo', StringIO.new(Base64.decode64(sign_photo)), 'image/png', 'signature_photo.png') if sign_photo.present?
        signature.upload_media_file('signature_stroke', StringIO.new(sign_stroke), 'plain/text', 'signature_stroke.txt') if sign_stroke.present?
      end
      SignatureProcessWorker.perform_async(self.name, signature.id) if signature.present?
      signature
    end

    def signatures_of(category)
      signatures = []
      signatures += signature_category.select('distinct on (category) *') if category.nil? || category == 'signature'
      signatures += stamp_category if category.nil? || category == 'stamp'
      signatures
    end

  end

  def display_category
    case category
    when 'signature', 'initial'
      'signature'
    else
      category
    end
  end

end
