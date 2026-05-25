module AccessCheck
  class DeclineTask < SignTheTask

    def set_check_action(check_action)
      @check_action = 'decline_task'
    end

    def check_stage_accessible
      check_the_stage = @check_stage.is_a?(SignStage) || (@source.is_a?(Envelope) && @check_stage.is_a?(DummyStage))
      raise ServiceError.new(:decline_not_allowed) unless check_the_stage && @check_stage.allowed_to_decline?(@member.id)
    end

    def check_member_accessible
      raise ServiceError.new(:decline_not_allowed) if @source.owned_by_member?(@member)
      raise ServiceError.new(:decline_not_allowed) unless @check_stage.actor_id == @member.id
    end

    def check_group_member_accessible
      raise ServiceError.new(not_accessible_type) unless @source.related_to_member?(@member)
      raise ServiceError.new(:decline_not_allowed) if @source.owned_by_member?(@member)
      stage_group_id = @check_stage.is_a?(SignStage) ? @check_stage.group_id : @check_stage.source.sign_stages.find_by(sequence: @check_stage.sequence).group_id
      raise ServiceError.new(:decline_not_allowed) unless @check_stage.actor_id == @member.id && stage_group_id == @member.group_id
    end

  end
end
