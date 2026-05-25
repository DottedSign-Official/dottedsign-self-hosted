module Kiosk
  class Sign < Normal::Sign

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
      notify_task_owner
      @result = @task
    end

    private

    def verify_for_sign
      verify = Verify.call(@task_id, @member, @sign_info, @client_info)
      raise verify.error if verify.failed?
      @task = verify.task
      @stage = verify.stage
    end

    def record_sign_event
      @task.add_sign_event(:signed, nil, stage_info: @stage.basic_info, client_info: @client_info, other_info: { action_mode: 'kiosk' })
    end

    def notify_task_owner
      notify_member_id = @task.owner_id
      notify_event = 'task_sign'
      push_options = { event_user: @stage.actor_display_name, doc_name: @task.file_name, share_link: @task.preview_share_link }
      SocketCenter.broadcast(notify_member_id, event: notify_event, payload: { task_id: @task.id })
      NotificationCenter.delay.raise_if_server_failed('target_push', notify_event, notify_member_id, push_options)
    end
  end
end
