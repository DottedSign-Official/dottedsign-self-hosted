module Envelopes
  class ReadVerify < Envelopes::Verify
    attr_reader :envelope, :stage, :action_mode, :member, :quick_sign_accept_at

    def initialize(envelope_id, member, read_info, client_info)
      @envelope_id = envelope_id
      @member = member
      @read_info = read_info
      @verify_info = @read_info[:verify_info] || {}
      @client_info = client_info
    end

    def call
      check_client
      check_envelope
      check_stage
      detect_action_mode
      check_acceptance if @action_mode == :quick
      verify_for_stage if need_verify?
      save_verify_events
      @result = @verify_tokens&.compact_blank || {}
    end

    private

    def check_envelope
      checker = EnvelopeChecker.call(@envelope_id, @member, check_action: 'view_task')
      if checker.success?
        @envelope = checker.result
      else
        raise checker.error
      end
    end

    def check_stage
      @stage = @envelope.processing_stages.find_by(actor_id: @member.id)
      @stage ||= @envelope.dummy_stages.done.order(id: :desc).find_by(actor_id: @member.id)
    end

    def detect_action_mode
      @action_mode = @member.is_registered? ? :normal : :quick
    end

    def check_acceptance
      return unless is_member_turn?
      accept_info = RedisAssistant.read_and_retry("#{@client_info[:code]}:quick_sign_accept")
      request_accept_info = {
        owner_email: @envelope.owner.email,
        owner_name: @envelope.owner.display_name,
        signer_email: @member.email,
        signer_name: @member.display_name
      }
      raise ServiceError.new(:quick_sign_not_accepted, request_accept_info) if accept_info.blank?
      raise ServiceError.new(:quick_sign_not_accepted, request_accept_info) unless accept_info[:client] == @client_info[:client] && accept_info[:ip_address] == @client_info[:ip_address] && accept_info[:work_id] == @client_info[:work_id]
      @quick_sign_accept_at = accept_info[:accepted_at]
    end

    def is_member_turn?
      @stage.processing?
    end

    def need_verify?
      return false if @stage.nil? && (@envelope.owned_by_member?(@member) || @envelope.owned_by_group_others?(@member))
      if @stage.present?
        return false if @envelope.draft? || @envelope.finished?
        return false if @stage.finished?
        return true
      end
    end

    def verify_for_stage
      prepare_for_verify
      verify = StageVerify.call(@stage, @verify_info, @client_info, execute_type: @verify_execute_type, verify_occassion: 'read')
      if verify.failed?
        preprocess_verify_failed_error(verify.error)
        raise verify.error
      end
      @verify_event_infos = verify.result[:verify_event_infos]
      @verify_tokens = verify.result.except(:verify_event_infos)
    end

    def prepare_for_verify
      @verify_execute_type = @action_mode
      @verify_action = 'verified'
      @verify_member_id = @member.id
    end

  end
end
