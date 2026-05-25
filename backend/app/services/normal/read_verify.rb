module Normal
  class ReadVerify < Verify
    attr_reader :action_mode, :viewing_stage, :quick_sign_accept_at

    ALLOW_CLIENTS = ['app', 'web'].freeze

    def initialize(task_id, member, read_info, client_info)
      @task_id = task_id
      @member = member
      @read_info = read_info
      @verify_info = @read_info[:verify_info] || {}
      @client_info = client_info
    end

    def call
      check_client
      check_task
      detect_action_mode
      check_stage
      check_acceptance if @action_mode == :quick
      verify_for_stage if need_verify?
      save_verify_events
      @result = @verify_tokens&.compact_blank || {}
    end

    private

    def check_task
      checker = TaskChecker.call(@task_id, @member, check_action: 'view_task')
      if checker.success?
        @task = checker.result
      else
        raise checker.error
      end
    end

    def detect_action_mode
      @action_mode = @member.is_registered? ? :normal : :quick
    end

    # @stage: 用戶處理中的 stage
    # @viewing_stage: 用戶處理中 stage 的 base stage
    def check_stage
      @stage = @task.sign_stages.processing.find_by(actor_id: @member.id)
      @viewing_stage = @stage&.action_review? ? @stage.base_stage : @stage

      @stage ||= @task.sign_stages.acting.find_by(actor_id: @member.id)
      @stage ||= @task.sign_stages.filled.order(id: :desc).find_by(actor_id: @member.id)
      @stage ||= @task.sign_stages.initial.order(id: :desc).find_by(actor_id: @member.id)
      @viewing_stage ||= @stage
    end

    def is_member_turn?
      if @stage.is_a?(SignStage)
        @stage.acting?
      end
    end

    def check_acceptance
      return unless is_member_turn?
      accept_info = RedisAssistant.read_and_retry("#{@client_info[:code]}:quick_sign_accept")
      request_accept_info = {
        owner_email: @task.owner.email,
        owner_name: @task.owner.display_name,
        signer_email: @member.email,
        signer_name: @member.display_name
      }
      raise ServiceError.new(:quick_sign_not_accepted, request_accept_info) if accept_info.blank?
      raise ServiceError.new(:quick_sign_not_accepted, request_accept_info) unless accept_info[:client] == @client_info[:client] && accept_info[:ip_address] == @client_info[:ip_address] && accept_info[:work_id] == @client_info[:work_id]
      @quick_sign_accept_at = accept_info[:accepted_at]
    end

    def need_verify?
      return false if @stage.nil? && (@task.owned_by_member?(@member) || @task.owned_by_group_others?(@member))
      if @stage.present?
        return false if @task.draft? || @task.finished?
        return false if @stage.is_a?(SignStage) && @stage.finished?
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
