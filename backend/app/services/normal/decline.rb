module Normal
  class Decline < ServiceCaller

    def initialize(task_id, member, decline_info, client_info)
      @task_id = task_id
      @member = member
      @decline_info = decline_info
      @client_info = client_info
    end

    def call
      setup_task
      setup_stage
      check_accessibility
      ActiveRecord::Base.transaction do
        decline_the_task
        record_decline_log
      end
      email_members
      notify_members
      @result = @task.display(@member.id)
    end

    private

    def setup_task
      @task = SignTask.find_by_id(@task_id)
      raise ServiceError.new(:task_not_found) if @task.nil?
    end

    def setup_stage
      @stage = @task.sign_stages.signing.find_by(actor: @member)
      raise ServiceError.new(:not_signer_turn) if @stage.nil?
    end

    def check_accessibility
      accessibility = @task.accessibility_of(@member, 'decline_task', check_stage: @stage)
      raise ServiceError.new(accessibility) unless accessibility == :accessible
    end

    def decline_the_task
      @stage.declined!
      record_decline_event
      @task.do_declined
    end

    def record_decline_event
      @event = @task.add_sign_event(:declined, @member.id, stage_info: @stage.basic_info, client_info: @client_info)
    end

    def record_decline_log
      decline_attrs = {
        sign_task: @task,
        sign_stage: @stage,
        sign_event: @event
      }.merge(@decline_info)
      DeclineLog.create(decline_attrs)
    end

    def email_members
      Notification::DeclinedMailWorker.perform_async(@task.id)
    end

    def notify_members
      member_ids = @task.related_member_ids
      payloads = {
        task_id: @task.id
      }
      SocketCenter.broadcast_to_many(member_ids, event: 'task_declined', payload: payloads)

      notify_member_ids = @task.has_order? ? ([@task.owner.id] + @task.sign_stages.finished.pluck(:actor_id)).uniq : @task.related_member_ids
      notify_member_ids.each do |notify_member_id|
        NotificationCenter.delay.raise_if_server_failed('target_push', 'task_declined', notify_member_id, event_user: @member.display_name, doc_name: @task.file_name, share_link: @task.preview_share_link)
      end
    end

  end
end
