module AccessCheck
  class ViewTask < General

    def set_check_action(check_action)
      @check_action = 'view_team_tasks'
    end

    def check_source_accessible
      super
      return if @member.is_registered
      raise ServiceError.new(generate_error_key(:was_expired)) if @source.expired?
      raise ServiceError.new(generate_error_key(:was_declined)) if @source.declined?
      raise ServiceError.new(generate_error_key(:not_waiting)) unless @source.waiting?
    end

    def check_stage_accessible
      return if @stage.nil?
      return if @member.is_registered
      raise ServiceError.new(:not_signer_turn) unless @stage.is_a?(SignStage) && @stage.acting?
    end

    def check_member_accessible
      raise ServiceError.new(generate_error_key(:was_declined)) if @source.declined? && !@source.owned_by_member?(@member)
    end

    def check_group_permission_accessible
      if @source.declined?
        return if @source.owned_by_member?(@member)
        return if @source.owned_by_group_others?(@member) && @group_permission[@check_action]
        raise ServiceError.new(generate_error_key(:was_declined)) if @source.acted_by_member?(@member)
      else
        return if @source.related_to_member?(@member)
        return if @group_permission[@check_action]
      end
      raise ServiceError.new(not_accessible_type)
    end

  end
end
