module Normal
  class Read < ServiceCaller
    attr_reader :source, :stage, :viewing_stage

    def initialize(task_id, member, read_info, client_info)
      @task_id = task_id
      @member = member
      @read_info = read_info
      @client_info = client_info
    end

    def call
      verify_for_read
      record_view_event
      record_quick_accept_event if @stage.present? && @action_mode == :quick
      @result = @verify_tokens
      @result[:current_available_actions] = current_available_actions
      @result[:viewable_attachments] = StageViewableAttachments.call(@task.id, @stage&.id, @reader.id).result
      @result
    end

    private

    def verify_for_read
      verify = ReadVerify.call(@task_id, @member, @read_info, @client_info)
      raise verify.error if verify.failed?
      @source = @task = verify.task
      @stage = verify.stage
      @viewing_stage = verify.viewing_stage
      @stage_info = verify.stage&.basic_info || {}
      @action_mode = verify.action_mode
      @reader = verify.member
      @quick_sign_accept_at = verify.quick_sign_accept_at
      @verify_tokens = verify.result
    end

    def record_view_event
      action_name = @task.related_member_ids.include?(@reader.id) ? :viewed : :group_viewed
      @task.add_sign_event(action_name, @reader.id, stage_info: @stage_info, client_info: @client_info, other_info: event_extra_info)
    end

    def record_quick_accept_event
      quick_sign_info = event_extra_info
      quick_sign_info[:created_at] = Time.at(@quick_sign_accept_at)
      quick_sign_info[:waiting_member_emails] = []
      @task.add_sign_event(:accept_quick_sign, @reader.id, stage_info: @stage_info, client_info: @client_info, other_info: quick_sign_info)
    end

    def event_extra_info
      return @event_extra_info if @event_extra_info.present?
      @event_extra_info = @stage.present? ? @stage.event_info : {}
      @event_extra_info[:execute_type] = @action_mode
      @event_extra_info
    end

    def current_available_actions
      actions = ['view']
      case @stage&.class&.base_class&.name
      when 'SignStage'
        actions << 'sign' if @stage.signing?
        actions << 'review' if @stage.reviewing?
        actions << 'confirm' if @stage.reviewed?
      end

      actions
    end

  end
end
