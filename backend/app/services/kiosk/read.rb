module Kiosk
  class Read < Normal::Read

    def initialize(task_id, member, read_info, client_info)
      @task_id = task_id
      @member = member
      @read_info = read_info
      @client_info = client_info
    end

    def call
      verify_for_read
      record_view_event
      @result = @task
    end

    private

    def verify_for_read
      verify = ReadVerify.call(@task_id, @member, @read_info, @client_info)
      raise verify.error if verify.failed?
      @task = verify.task
      @stage = verify.stage
    end

    def record_view_event
      other_info = {execute_type: 'kiosk'}
      @task.add_sign_event(:viewed, nil, stage_info: @stage.basic_info, client_info: @client_info, other_info: other_info)
    end

  end
end
