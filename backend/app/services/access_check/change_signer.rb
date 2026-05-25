module AccessCheck
  class ChangeSigner < General

    def check_source_accessible
      raise ServiceError.new(generate_error_key(:not_waiting)) unless @source.waiting?
    end

    def check_stage_accessible
      return if @check_stage.nil?
      raise ServiceError.new(:stage_already_done) if @check_stage.finished?
      raise ServiceError.new(:forward_not_allowed) if @check_stage.had_acted?
    end

    def check_member_accessible
      if @check_stage.present?
        raise ServiceError.new(:forward_not_allowed) unless @check_stage.allowed_to_forward?(@member.id)
      else
        raise ServiceError.new(:forward_not_allowed) unless @source.stages.on_going.any? do |stage|
          stage.allowed_to_forward?(@member.id)
        end
      end
    end

    def check_group_member_accessible
      check_member_accessible
    end

  end
end
