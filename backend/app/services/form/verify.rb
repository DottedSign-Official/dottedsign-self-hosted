module Form
  class Verify < Normal::Verify
    attr_reader :action_mode, :task, :stage, :member

    VALID_VERIFY_TYPES = [:read, :sign].freeze

    def initialize(task_id, member, sign_info, client_info)
      super(task_id, member, sign_info, client_info)
      @code_info = { code: sign_info[:form_token] }
      @action_mode = :form
    end

    def call
      check_client
      check_task
      check_stage
      check_signer_info
      executable_check
      verify_for_stage
      save_verify_events
    end

    private

    def check_task(check_action: 'sign_the_task')
      super(check_action: check_action) # setup @task and @actor
      raise ServiceError.new(:task_not_form) unless @task.form?
    end

    def check_stage
      @stage = @task.processing_stages.find_by(actor_id: @actor.id)
      raise ServiceError.new(:stage_not_found) if @stage.nil?
      raise ServiceError.new(:stage_not_form) unless @stage.action_form_sign?
      raise ServiceError.new(:stage_still_initial) if @stage.initial?
    end

    def check_signer_info
      raise ServiceError.new(:signer_info_not_ready, signer_requisite: @stage.stage_setting&.requisite, signer_role: @stage.actor_info['role']) unless @stage.actor_info_ready?
    end

    def verify_for_stage
      prepare_for_verify
      verify = StageVerify.call(@stage, @verify_info, @client_info)
      if verify.failed?
        preprocess_verify_failed_error(verify.error)
        raise verify.error
      end
      @verify_event_infos = verify.result[:verify_event_infos]
      @verify_tokens = verify.result.except(:verify_event_infos)
    end
  end
end
