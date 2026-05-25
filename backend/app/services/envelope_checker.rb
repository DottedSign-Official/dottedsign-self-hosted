class EnvelopeChecker < TaskChecker

  def initialize(envelope_id, member, check_action: 'view_task', ownership: false)
    @envelope_id = envelope_id
    @member = member
    @check_action = check_action
    @ownership = ownership
    @source_name = 'envelope'
  end

  def call
    obtain_envelope
    check_accessibility
    check_ownership if @ownership
    check_deleted
    @result = @source
  end

  private

  def obtain_envelope
    @source = @envelope = Envelope.includes(:dummy_stages, sign_tasks: :sign_stages).find_by_id(@envelope_id)
    raise ServiceError.new(:envelope_not_found) if @envelope.nil?
  end
end