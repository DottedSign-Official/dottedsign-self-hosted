module Normal
  class Sign < ServiceCaller

    def initialize(task_id, member, sign_info, client_info, skip_verify: false)
      @task_id = task_id
      @member = member
      @sign_info = sign_info
      @client_info = client_info
      @skip_verify = skip_verify
    end

    def call
      # verify_for_sign will setup attachment files if needed (cannot be in transaction)
      # skip verify step if called from envelope sign
      @skip_verify ? setup_source : verify_for_sign
      sign_the_task
      record_sign_event
      record_sign_log
      notify_task_members
      @result = task_info
    end

    private

    def verify_for_sign
      verify = Verify.call(@task_id, @member, @sign_info, @client_info)
      if verify.failed?
        raise ServiceError.new(:system_ca_not_found) if verify.error.message.match?(/system_ca_not_found/)
        raise verify.error
      end
      @task = verify.task
      @stage = verify.stage
      @action_mode = verify.action_mode
      @signer = verify.member
    end

    def setup_source
      @task = SignTask.find_by_id(@task_id)
      @signer = @member
      @stage = @task.sign_stages.processing.find_by(actor_id: @signer.id)
      @action_mode = @signer.is_registered ? :normal : :quick
    end

    def sign_the_task
      @datetime = Time.now
      @stage.sign(@sign_info[:signature_info], options: { timestamp: @datetime.to_i })
      @stage.service_files.where('label ~* ?', 'attachment_\d+_\d+$').where(uploaded_at: nil).destroy_all
    end

    def record_sign_event
      stage_info = @stage.basic_info
      stage_info[:other_info] = { 'stage_last_action' => true } if @stage.done?
      @event = @task.add_sign_event(:signed, @signer.id, stage_info: stage_info, client_info: @client_info, other_info: { action_mode: @action_mode }, action_time: @datetime)
    end

    def record_sign_log
      SignLog.create!(
        source: @task,
        stage: @stage,
        sign_event: @event,
        signed_fields: @sign_info[:signature_info].to_a.map do |sign_field|
          {
            field_object_id: sign_field[:object_id],
            changed: sign_field[:changed].nil? ? true : sign_field[:changed]
          }
        end,
        signed_attachments: @sign_info[:attachment_info].to_a.map { |sign_attachment| sign_attachment.slice(:attachment_id, :changed) },
        created_at: @datetime,
        updated_at: @datetime
      )
    end

    def notify_task_members
      notify_member_ids = @task.related_member_ids.compact.uniq
      notify_event = 'task_sign'
      push_options = { event_user: @signer.display_name, doc_name: @task.file_name, share_link: @task.preview_share_link }
      SocketCenter.broadcast_to_many(notify_member_ids, event: notify_event, payload: { task_id: @task.id })
      SocketCenter.broadcast_to_code(@sign_info[:code], event: notify_event, payload: { task_id: @task.id }) if @action_mode == :quick
      notify_member_ids.each do |member_id|
        NotificationCenter.delay.raise_if_server_failed('target_push', notify_event, member_id, push_options)
      end
    end

    def task_info
      task_info = @task.display(@member.id)
      task_info[:after_sign_category] = @task.category_after_stage_sign(@stage)
      task_info
    end
  end
end
