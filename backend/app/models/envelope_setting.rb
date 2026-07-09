class EnvelopeSetting < Setting
  belongs_to :envelope

  after_commit :deadline_changed, on: :update, if: :deadline_previously_changed?

  alias :source :envelope
  alias_attribute :source_id, :envelope_id

  include Settings::Encryptable
  class << self
    def setup_from_source_id(envelope_id)
      find_or_initialize_by(envelope_id: envelope_id)
    end
  end

  def source_type
    'Envelope'
  end
end
