class VerifyMethod < ApplicationRecord
  belongs_to :stage, polymorphic: true

  before_validation :check_phone, if: :verify_source_changed?
  before_create :assign_uuid
  before_save :assign_inperson_verify_source, if: :inperson?

  enum execute_type: [:normal, :inperson]
  enum occassion: { sign: 'sign', read: 'read' }

  OTP_INTERVAL = 10.minutes
  CERT_INTERVAL = 1.day
  TRIGGER_INTERVAL = 20.seconds
  VERIFY_TYPE_DISPLAY_MAP = {
    'email' => 'Email',
    'sms' => 'SMS'
  }.freeze
  VALID_TYPES = ['signer_detect', 'email', 'sms', 'cht_personal', 'cht_company', 'cht_system'].freeze
  OTP_TYPES = ['email', 'sms', 'signer_detect'].freeze
  CERT_TYPE = ['cht_personal', 'cht_company', 'cht_system'].freeze
  ALLOW_VISIBLE_TYPES = ['signature', 'textfield', 'checkbox'].freeze

  include Triggerable
  include Verifiable

  class << self

    def setup_from_request(stage_type, stage_id, verify_attrs)
      verify_attrs.each_with_index do |verify_info, index|
        check_system_ca_accessibility(stage_type, stage_id, verify_info[:verify_source]) if specified_system_ca?(verify_info)
        sequence = verify_info[:sequence] || 1
        verify_method = VerifyMethod.new(stage_type: stage_type, stage_id: stage_id, sequence: sequence)
        verify_method.assign_attributes(verify_info)
        verify_method.save
      end
    end

    def check_system_ca_accessibility(stage_type, stage_id, system_ca_id)
      case stage_type
      when 'SignStage'
        stage_singer = SignStage.find(stage_id).actor
        system_ca = stage_singer.group&.system_cas&.find_by(id: system_ca_id)
      when 'DummyStage'
        system_ca = SystemCa.find(system_ca_id)
      else
        raise "invalid_stage_type"
      end

      raise "system_ca_not_found" unless system_ca.present?
    end

    private

    def specified_system_ca?(verify_info)
      verify_info[:verify_type] == 'cht_system' && verify_info[:verify_source].present?
    end

  end

  def display
    as_json(only: [:verify_type, :verify_source, :uuid, :sequence, :occassion])
  end

  def verify_infos(custom_info: {})
    case verify_type
    when 'signer_detect'
      actor_verify_infos
    when 'email'
      [{ verify_type: 'email', verify_source: verify_source || stage.email, uuid: uuid, sequence: sequence, occassion: occassion }]
    else
      [display.symbolize_keys.merge(custom_info)]
    end
  end

  def totp
    ROTP::TOTP.new(otp_secret_key)
  end

  private

  def assign_uuid
    loop do
      self.uuid = SecureRandom.uuid
      break if VerifyMethod.find_by(uuid: uuid).nil?
    end
  end

  def assign_inperson_verify_source
    return if verify_source.present? || verify_type == 'sms'
    self.verify_source = stage.email
  end

  def otp_secret_key
    ROTP::Base32.encode("#{Secrets.otp_base_key}_#{uuid}_#{trigger_at}")
  end

  def actor_verify_infos
    verify_infos = stage.actor&.verify_infos
    if verify_infos.present?
      verify_infos.map do |verify_info|
        verify_info.merge(uuid: uuid, sequence: sequence, occassion: occassion)
      end
    else
      [{
         verify_type: 'email',
         verify_source: stage.email,
         uuid: uuid,
         sequence: sequence,
         occassion: occassion
       }]
    end
  end

  def check_phone
    return unless verify_type == 'sms' && verify_source.present?
    normalize_phone_number = verify_source.scan(/\d+/).join('')
    phone = Phonelib.parse("+#{normalize_phone_number}")
    if phone.valid?
      self.verify_source = "+#{phone.country_code}-#{phone.raw_national}"
    else
      errors.add(:verify_source, 'invalid_phone')
    end
  end

  def same_stage_verify_steps
    @same_stage_verify_steps ||= stage.verify_methods.send(execute_type).where(sequence: sequence)
  end

end
