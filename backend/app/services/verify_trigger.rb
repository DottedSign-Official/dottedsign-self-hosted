class VerifyTrigger < ServiceCaller

  def initialize(source, member_id, uuid, signer_email)
    @source = source
    @source_name = source.is_a?(Envelope) ? :envelope : :task
    @member_id = member_id
    @uuid = uuid
    @signer_email = signer_email
  end

  def call
    setup_member
    check_source
    check_stage
    @result = trigger_verify
  end

  private

  def setup_member
    @member = Member.find_by_email(@signer_email)
    raise ServiceError.new(:signer_not_found) if @member.nil?
  end

  def check_source
    accessibility = @source.accessibility_of(@member)
    raise ServiceError.new(accessibility) unless accessibility == :accessible
    raise ServiceError.new(generate_error_key(:deleted)) if @source.deleted?
    raise ServiceError.new(generate_error_key(:not_signable)) unless @source.signable?
  end

  def check_stage
    @stage = @source.stages.acting.find_by_actor_id(@member.id)
    raise ServiceError.new(:not_signer_turn) if @stage.nil?
  end

  def trigger_verify
    @verified_stage = @source.is_a?(Envelope) ? StageFinder.find_by_sequence(@source.sign_stages, @stage.sequence) : @stage
    @verify_method = @verified_stage.verify_methods.find_by_uuid(@uuid)
    if @verify_method.present?
      trigger_for_owner_setting
    else
      trigger_for_signer_setting
    end
  end

  def trigger_for_owner_setting
    raise ServiceError.new(:request_too_frequently) unless @verify_method.triggerable?
    @verify_method.trigger_now
  end

  def trigger_for_signer_setting
    raise ServiceError.new(:verify_step_not_found) unless @member.receive_otp_always
    pre_verify = RedisAssistant.read_and_retry("signer_verify:#{@uuid}")
    raise ServiceError.new(:request_too_frequently) if pre_verify.present? && (pre_verify[:trigger_at] + VerifyMethod::TRIGGER_INTERVAL > Time.zone.now.to_i)
    deliver = OtpDeliver.call(@verified_stage.class.base_class.name, @verified_stage.id, @uuid, @member.verify_infos)
    raise deliver.error if deliver.failed?
    deliver.result
  end

  def generate_error_key(error_name)
    "#{@source_name}_#{error_name}".to_sym
  end
end
