module Form
  class Read < Normal::Read
    attr_reader :task

    def initialize(task_id, member, read_info, client_info)
      @task_id = task_id
      @member = member
      @read_info = read_info
      @client_info = client_info
    end

    def call
      verify_for_read
      record_view_event
      @result = @verify_tokens
      @result[:viewable_attachments] = StageViewableAttachments.call(@task.id, @stage&.id, @reader.id).result
    end

    private

    def verify_for_read
      verify = ReadVerify.call(@task_id, @member, @read_info, @client_info)
      raise verify.error if verify.failed?
      @task = verify.task
      @stage = verify.stage
      @stage_info = verify.stage&.basic_info || {}
      @action_mode = verify.action_mode
      @reader = verify.member
      @quick_sign_accept_at = verify.quick_sign_accept_at
      @verify_tokens = verify.result
    end
  end
end
