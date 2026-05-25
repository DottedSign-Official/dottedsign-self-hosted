module AccessCheck
  class ChangeOwner < General

    def check_source_accessible
      return raise ServiceError.new(generate_error_key(:not_transferable)) unless @source.transferable?
    end

    def check_stage_accessible
      return
    end

    def check_member_accessible
      raise ServiceError.new(:not_owner) unless @source.owner_id == @member.id
    end

    def check_group_member_accessible
      check_member_accessible
    end

  end
end
