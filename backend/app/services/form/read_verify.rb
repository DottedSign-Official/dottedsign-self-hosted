module Form
  class ReadVerify < Verify
    attr_reader :action_mode, :quick_sign_accept_at

    ALLOW_CLIENTS = ['app', 'web'].freeze

    def initialize(task_id, member, read_info, client_info)
      @task_id = task_id
      @member = member
      @read_info = read_info
      @signer_info = read_info[:signer_info]
      @verify_info = @read_info[:verify_info] || {}
      @client_info = client_info
      @action_mode = :form
      @quick_sign_accept_at = Time.zone.now.to_i
    end

    def call
      check_client
      check_task
      check_stage
      verify_for_stage
      save_verify_events
      verify_for_read
      @result = @verify_tokens&.compact_blank || {}
    end

    private

    def check_task
      super(check_action: 'view_task')
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
      @verify_execute_type = :quick
      @verify_action = 'verified'
      @verify_member_id = @member.id
    end

    def verify_for_read
      @stage.actor_info.merge!(@signer_info)
      Member.setup_member(@stage.actor_info['email']) if @stage.actor_info['email'].present?
      check_signer_info
      @stage.save
    end
  end
end
