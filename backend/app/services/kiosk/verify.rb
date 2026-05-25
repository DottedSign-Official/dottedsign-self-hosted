module Kiosk
  class Verify < Normal::Verify
    attr_reader :action_mode, :task, :stage

    def initialize(task_id, member, sign_info, client_info)
      @action_mode = :kiosk
      @task_id = task_id
      @member = member
      @sign_info = sign_info
      @actor_info = sign_info[:actor_info] || sign_info[:signer_info]
      @verify_info = sign_info[:verify_info] || {}
      @client_info = client_info
      @attachment_info = sign_info[:attachment_info] || {}
    end

    def call
      setup_task
      check_client
      check_actor_info
      set_stage
      check_event
      setup_actor_info
      verify_now
    end

    private

    def setup_task
      checker = TaskChecker.call(@task_id, @member, ownership: true)
      raise checker.error if checker.failed?
      @task = checker.result
    end

    def check_client
      raise ServiceError.new(:sign_invalid_client) unless @task.client_info_match?(@client_info)
    end

    def check_actor_info
      return unless @actor_info.present? && @actor_info[:email].present?
      checker = MailCheck.call(@actor_info[:email], check_options: [:domain])
      if checker.success?
        @actor_info[:email] = checker.result[:valid_email]
      else
        raise checker.error
      end
    end

    def set_stage
      @stage = @task.dummy_stages.processing.first
      raise ServiceError.new(:stage_not_found) if @stage.nil?
    end

    def get_previous_view_event
      @previous_view_event = @stage.sign_events.find_by(action_name: 'viewed')
    end

    def check_event
      get_previous_view_event
      check_long_winded
    end

    def check_long_winded
      raise ServiceError.new(:kiosk_not_read) if @previous_view_event.nil?
      raise ServiceError.new(:kiosk_delay_sign) if @previous_view_event.created_at + Settings.kiosk_delay_threshold < Time.zone.now
    end

    def setup_actor_info
      if @actor_info.present?
        @stage.actor_info.merge!(@actor_info.stringify_keys.reject { |_, v| v.blank? })
        @stage.save!
      end
      raise ServiceError.new(:signer_info_not_ready, task_name: @task.file_name, signer_requisite: @stage.stage_setting&.requisite, signer_role: @stage.actor_info['role']) unless @stage.actor_info_ready?
    end

    def verify_now
      executable_check
    end

    def executable_check
      field_setting_check
      field_setting_group_check
      attachment_check
    end

  end
end
