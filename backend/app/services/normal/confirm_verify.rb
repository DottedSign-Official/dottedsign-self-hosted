module Normal
  class ConfirmVerify < Verify

    def initialize(task_id, member, confirm_info, client_info)
      @task_id = task_id
      @member = member
      @confirm_info = confirm_info
      @verify_info = confirm_info[:verify_info]
      @code_info = confirm_info.slice(:code)
      @client_info = client_info
      @verify_action = 'confirm_verified'
    end

    def call
      check_client
      check_task(check_action: 'confirm_task')
      check_stage
      detect_action_mode
      verify_now
      save_verify_events
    end
  end
end
