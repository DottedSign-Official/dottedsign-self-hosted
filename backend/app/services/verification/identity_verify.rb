module Verification
  class IdentityVerify < ServiceCaller
    include JwtCodeProcess

    def initialize(stage, verify_info, client_info, execute_type: 'normal', verify_occassion: 'sign')
      @stage = stage
      @verify_info = verify_info
      @client_info = client_info
      @execute_type = execute_type
      @verify_occassion = verify_occassion
    end

    def call
      obtain_verify_methods
      return if @verify_methods.blank?

      if @verify_info[:identity_verify_token].present?
        identity_verify_token_verify
        @result = format_verify_detail
      elsif @verify_info[:uuid].nil?
        trigger_identity_verify(sequence: 1)
      else
        verify_identity
        next_sequence = @verify_step.sequence + 1
        trigger_identity_verify(sequence: next_sequence)
        generate_identity_verify_token
        @result = format_verify_detail
      end
    end

    private

    def obtain_verify_methods
      # Envelope uses dummy_stages, which do not have verify_methods
      # so using the same sequence sign_stage from the first sign_task
      @verified_stage = @stage.is_a?(SignStage) ? @stage : StageFinder.find_by_sequence(@stage.source.sign_stages, @stage.sequence)

      if @execute_type == :quick
        @verify_methods = @verified_stage.verify_methods.normal.send(@verify_occassion)
      else
        @verify_methods = @verified_stage.verify_methods.send(@execute_type).send(@verify_occassion)
      end
    end

    def identity_verify_token_verify
      raise ServiceError.new(:verify_failed) unless code_match?(@verify_info[:identity_verify_token], payload_base, matched_columns: payload_base.keys)
      raise ServiceError.new(:code_expire) if code_expired?(@verify_info[:identity_verify_token])
      @code_info[:identity_verify_token] = @verify_info[:identity_verify_token]
    end

    def trigger_identity_verify(sequence: 1)
      verify_method = @verify_methods.find_by(sequence: sequence)
      return if verify_method.nil?
      return if verify_method.need_cert? && verify_method.stage.review_stages.on_going.present?
      need_verify_info = verify_method.trigger_now
      raise ServiceError.new(:stage_need_verify, verify_info: need_verify_info, verify_for: 'identity_verify', asked_by: @stage.source.owner.display_name) if need_verify_info.present?
    end

    def verify_identity
      @verify_step = @verify_methods.find_by_uuid(@verify_info[:uuid])
      raise ServiceError.new(:verify_step_not_found) if @verify_step.nil?
      verify_at = @verify_step.verify(@verify_info[:verify_data])
      raise ServiceError.new(:verify_failed) if verify_at.nil?
      @verify_step.set_verify_time(verify_at)
    end

    def format_verify_detail
      detail = @stage.event_info
      detail[:other_info] = @code_info.slice(:verify_at, :verify_for, :verify_source, :identity_verify_token, :tid)
      detail
    end

    def generate_identity_verify_token
      @code_info = payload_base
      @code_info[:verify_at] = Time.zone.now.to_i
      @code_info[:verify_source] = RedisAssistant.read_and_retry("#{@verified_stage.class.base_class.name}:#{@verified_stage.id}:verify_source")
      @code_info[:verify_occassion] = @verify_occassion
      @code_info[:identity_verify_token] = generate_code(@code_info, expires_in: 8.hour)
      @code_info[:tid] = RedisAssistant.read_and_retry("#{@verified_stage.class.base_class.name}:#{@verified_stage.id}:tid")
    end

    def payload_base
      {
        stage_type: @stage.class.base_class.name,
        stage_id: @stage.id,
        verify_for: 'identity_verify',
        client: @client_info[:client],
        ip_address: @client_info[:ip_address],
        work_id: Digest::SHA256.hexdigest(@client_info[:work_id].to_s)
      }
    end

  end
end
