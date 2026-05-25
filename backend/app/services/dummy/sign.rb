module Dummy
  class Sign < ServiceCaller

    def initialize(task_id, sign_info)
      @task_id = task_id
      @sign_info = sign_info
    end

    def call
      verify_for_sign
      sign_the_task
      record_sign_event
    end

    private

    def verify_for_sign
      verify = Verify.call(@task_id, nil, @sign_info, {})
      raise verify.error if verify.failed?
      @task = verify.task
      @stage = verify.stage
      @action_mode = verify.action_mode
      @client_info = @task.start_from.symbolize_keys
    end

    def sign_the_task
      @datetime = Time.now
      @stage.sign(@sign_info[:signature_info], options: { timestamp: @datetime.to_i })
    end

    def record_sign_event
      stage_info = @stage.basic_info
      @task.add_sign_event(:signed, nil, stage_info: stage_info, client_info: @client_info, other_info: { action_mode: @action_mode }, action_time: @datetime)
    end

  end
end
