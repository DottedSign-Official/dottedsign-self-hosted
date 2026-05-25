class ServiceFile < ApplicationRecord
  belongs_to :storable, polymorphic: true
  has_one_attached :file
  has_one_attached :thumbnail
  has_one :ca_retry, dependent: :destroy

  scope :uploaded, -> { where.not(uploaded_at: nil) }

  include Uploadable
  include Copyable
  include Downloadable
  include Cleanable

  PREVIEW_EXPIRED_IN = 2.day.to_i.freeze
  PREVIEWABLE_STORABLE_TYPE = %w[SignTask Envelope]
  #MIME types list: https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types/Common_types
  ALLOW_FILE_TYPES = %w[msword vnd.openxmlformats-officedocument.wordprocessingml.document vnd.ms-powerpoint
                      vnd.openxmlformats-officedocument.presentationml.presentation vnd.ms-excel vnd.openxmlformats-officedocument.spreadsheetml.sheet
                      zip x-rar vnd.rar x-rar-compressed x-7z-compressed gif pdf png jpg jpeg].freeze

  class << self

    def setup_for(storable, label)
      ServiceFile.find_or_create_by(storable: storable, label: label)
    end

  end

  def file_content
    return unless file.attached?
    file.download
  end

  def file_size
    if storable_type == 'Envelope'
      compressed_envelope_size
    else
      return unless file.attached?
      file_blob.byte_size
    end
  end

  def previewable?
    PREVIEWABLE_STORABLE_TYPE.include?(storable_type)
  end

  def preview_code(stage = nil, will_expired: true, default_member_email: nil)
    return unless previewable?
    return unless stage.nil? || stage.sign_task_id == storable_id || stage.source_id == storable_id
    payload = {
      file_id: id,
      email: stage&.email || default_member_email,
      stage_id: stage&.id,
      involved_emails: storable.related_emails
    }
    storable_id_key = storable_type == 'Envelope' ? :envelope_id : :task_id
    payload[storable_id_key] = storable_id
    payload[:expired_at] = Time.zone.now.to_i + PREVIEW_EXPIRED_IN if will_expired
    JWT.encode(payload, Secrets.jwt.secret, Secrets.jwt.encode_algorithm)
  end

  def file_name
    previewable? ? storable.file_name : label
  end

  def preview_info
    return {} unless previewable?
    info = as_json(only: [:storable_type, :storable_id], methods: [:file_name])
    info[:task_id] = storable.id
    info[:task_status] = storable.status
    info[:owner_email] = storable.owner.email
    info[:owner_name] = storable.owner.display_name
    info[:member_involved] = storable.related_emails
    info[:preview_url] = storable.original_file.download_link
    info
  end

  private

  def compressed_envelope_size
    buffer = Zip::OutputStream.write_buffer do |zip|
      storable.task_files_for_label(label).includes(file_attachment: :blob).each do |target_file|
        return unless target_file.file.attached?
        zip.put_next_entry(target_file.file_name.to_s)
        zip.write(target_file.file_content)
      end
    end
    buffer.string.bytesize
  end
end
