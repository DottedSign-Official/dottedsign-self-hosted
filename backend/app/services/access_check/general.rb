module AccessCheck
  class General < ServiceCaller

    def initialize(source, member, check_action: nil, check_stage: nil)
      @source = source
      @source_name = source.is_a?(Envelope) ? :envelope : :task
      @member = member
      @check_stage = check_stage
      set_check_action(check_action)
    end

    def call
      check_source_accessible
      check_stage_accessible
      if GROUP_USE && @member.group_id.present? && @source.related_to_group?(@member.group_id)
        get_group_permission
        check_group_member_accessible
        check_group_permission_accessible
      elsif @source.related_to_member?(@member)
        check_member_accessible
      else
        check_cc_member_accessible
      end

      @result = :accessible
    end

    protected

    def set_check_action(check_action)
      @check_action = check_action
    end

    def check_source_accessible
      raise ServiceError.new(generate_error_key(:deleted)) if @source.deleted?
    end

    def check_stage_accessible
      return
    end

    def check_member_accessible
      return
    end

    def get_group_permission
      @group_permission = @member.current_permission
    end

    def check_group_member_accessible
      return
    end

    def check_group_permission_accessible
      return unless @group_permission&.key?(@check_action)
      return if @group_permission[@check_action]
      raise ServiceError.new(not_accessible_type)
    end

    def check_cc_member_accessible
      raise ServiceError.new(not_accessible_type)
    end

    private

    def not_accessible_type
      if source_change_history.include?([@member.email, @member.group_id])
        generate_error_key(:was_forwarded)
      else
        generate_error_key(:not_accessible)
      end
    end

    def source_change_history
      @source.change_events.map do |event|
        old_group_id = GROUP_USE ? event.other_info['old_group_id'] : nil
        [event.other_info['old_email'], old_group_id]
      end
    end

    def generate_error_key(error_name)
      "#{@source_name}_#{error_name}".to_sym
    end
  end
end
