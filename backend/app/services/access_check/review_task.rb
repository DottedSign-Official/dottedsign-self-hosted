module AccessCheck
  class ReviewTask < SignTheTask

    def set_check_action(check_action)
      @check_action = 'review_task'
    end

    def check_stage_accessible
      return if @check_stage.nil?
      raise ServiceError.new(:not_signer_turn) unless @check_stage.is_a?(SignStage) && @check_stage.reviewing?
    end

    def check_member_accessible
      return if @check_stage.nil? && @source.acted_by_member?(@member, action: :review, status_scope: :processing)
      return if @check_stage.present? && @check_stage.actor_id == @member.id
      raise ServiceError.new(not_accessible_type)
    end

    def check_group_member_accessible
      return if @check_stage.nil? && @source.acted_by_member?(@member, action: :review, status_scope: :processing)
      return if @check_stage.present? && @check_stage.actor_id == @member.id && @check_stage.group_id == @member.group_id
      raise ServiceError.new(not_accessible_type)
    end
  end
end
