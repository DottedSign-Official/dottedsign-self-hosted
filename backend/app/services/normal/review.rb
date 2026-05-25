module Normal
  class Review < ServiceCaller
    attr_reader :task

    def initialize(task_id, member, review_info, client_info)
      @task_id = task_id
      @member = member
      @review_info = review_info
      @client_info = client_info
    end

    def call
      verify_for_review
      review_the_task
      record_review_event
      record_review_log
    end

    private

    def verify_for_review
      verify = ReviewVerify.call(@task_id, @member, @review_info, @client_info)
      raise verify.error if verify.failed?
      @task = verify.task
      @stage = verify.stage
      @base_stage = verify.base_stage
      @stage_info = verify.stage.basic_info
      @action_mode = verify.action_mode
    end

    def review_the_task
      if review_pass?
        @stage.do_pass
        @review_result = 'passed'
      else
        @stage.do_reject(@review_info[:review_message])
        @review_result = 'rejected'
      end
    end

    def record_review_event
      other_info = { execute_type: @action_mode, base_stage_id: @base_stage.id }
      @event = @task.add_sign_event("review_#{@review_result}", @member.id, stage_info: @stage_info, client_info: @client_info, other_info: other_info)
    end

    def record_review_log
      ReviewLog.create(
        source: @task,
        stage: @stage,
        sign_event: @event,
        reviewed_fields: @review_info[:review_fields].to_a.map { |review_field| review_field.slice(:field_object_id, :accepted) },
        reviewed_attachments: @review_info[:review_attachments].to_a.map { |review_attachment| review_attachment.slice(:attachment_id, :accepted) },
        reviewed_message: @review_info[:review_message].to_s
      )
    end

    def review_pass?
      return false if @review_info[:review_fields].any? { |result| !result[:accepted] }
      return false if @review_info[:review_attachments]&.any? { |result| !result[:accepted] }
      true
    end

  end
end
