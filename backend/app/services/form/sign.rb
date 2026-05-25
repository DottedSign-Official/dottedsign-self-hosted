module Form
  class Sign < Normal::Sign
    attr_reader :task, :stage

    def initialize(task_id, member, sign_info, client_info)
      @task_id = task_id
      @member = member
      @sign_info = sign_info
      @client_info = client_info
    end

    def call
      verify_for_sign
      sign_the_task
      record_sign_event
      record_sign_log
      notify_task_members
      @result = task_info
    end

    private

    def verify_for_sign
      verify = Verify.call(@task_id, @member, @sign_info, @client_info)
      raise verify.error if verify.failed?
      @task = verify.task
      @stage = verify.stage
      @action_mode = verify.action_mode
      @signer = verify.member
    end

    def task_info
      {
        after_sign_category: @task.category_after_stage_sign(@stage),
        form_token: @task.form_token
      }
    end

  end
end
