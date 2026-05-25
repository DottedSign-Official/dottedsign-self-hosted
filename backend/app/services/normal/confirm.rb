module Normal
  class Confirm < ServiceCaller
    attr_reader :task

    def initialize(task_id, member, confirm_info, client_info)
      @task_id = task_id
      @member = member
      @confirm_info = confirm_info
      @client_info = client_info
    end

    def call
      verify_for_confirm
      confirm_the_task
    end

    private

    def verify_for_confirm
      verify = ConfirmVerify.call(@task_id, @member, @confirm_info, @client_info)
      raise verify.error if verify.failed?
      @task = verify.task
      @stage = verify.stage
      @action_mode = verify.action_mode
    end

    def confirm_the_task
      record_confirm_event
      @stage.before_done
    end

    def record_confirm_event
      stage_info = @stage.basic_info
      @task.add_sign_event(:confirmed, @member.id, stage_info: stage_info, client_info: @client_info, other_info: { execute_type: @action_mode })
    end
  end
end