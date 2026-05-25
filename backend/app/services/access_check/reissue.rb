module AccessCheck
  class Reissue < General

    def set_check_action(check_action)
      @check_action = 'reissue'
    end

    def check_source_accessible
      super
      raise ServiceError.new(generate_error_key(:not_reissuable)) unless @source.reissuable?
    end

    def check_stage_accessible
     raise ServiceError.new(:stage_not_reissuable) unless @check_stage.reissuable?
    end

    def check_group_member_accessible
      return if @check_stage.actor == @member
      raise ServiceError.new(not_accessible_type) unless @member.admin_of_group?(@source.group_id) || @member.super_admin?
    end

    def check_cc_member_accessible
      return
    end

  end
end
