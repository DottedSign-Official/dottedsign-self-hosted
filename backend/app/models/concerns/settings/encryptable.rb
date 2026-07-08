module Settings::Encryptable
  extend ActiveSupport::Concern

  COMPLETION_PASSWORD_MAX_LENGTH = 50
  COMPLETION_PASSWORD_FORMAT = /\A[A-Za-z0-9_]+\z/.freeze

  included do
    self.extra_permitted_attributes = extra_permitted_attributes + %i[is_encrypted completion_password]

    before_validation :normalize_completion_password
    validate    :validate_completion_password
  end

  def display_info(member_id: nil)
    super(member_id: member_id).tap do |info|
      info[:is_encrypted] = is_encrypted
      info[:completion_password] = completion_password if source.owner_id == member_id
    end
  end

  private

  def normalize_completion_password
    self.completion_password = nil unless is_encrypted
  end

  def validate_completion_password
    return unless is_encrypted

    if completion_password.blank?
      errors.add(:completion_password, "can't be blank")
      return
    end

    if completion_password.length > COMPLETION_PASSWORD_MAX_LENGTH
      errors.add(:completion_password, 'is too long (maximum is 50 characters)')
    end

    unless completion_password.match?(COMPLETION_PASSWORD_FORMAT)
      errors.add(:completion_password, 'only allows letters, numbers, and underscores')
    end
  end
end
