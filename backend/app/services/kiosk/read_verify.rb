module Kiosk
  class ReadVerify < Kiosk::Verify
    attr_reader :action_mode, :task, :stage

    def initialize(task_id, member, read_info, client_info)
      @action_mode = :kiosk
      @task_id = task_id
      @member = member
      @read_info = read_info
      @actor_info = read_info[:actor_info] || read_info[:signer_info]
      @verify_info = read_info[:verify_info] || {}
      @client_info = client_info
    end

    def call
      setup_task
      check_client
      check_actor_info
      set_stage
      check_event
      setup_actor_info
    end

    private

    def check_event
      get_previous_view_event
      check_repeat_access
    end

    def check_repeat_access
      raise ServiceError.new(:kiosk_repeat_access) if @previous_view_event.present?
    end

  end
end
