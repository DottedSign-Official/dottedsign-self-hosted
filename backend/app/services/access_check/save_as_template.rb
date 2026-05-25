module AccessCheck
  class SaveAsTemplate < General

    def check_source_accessible
      super
      raise ServiceError.new(generate_error_key(:is_draft)) if @source.draft?
      raise ServiceError.new(generate_error_key(:was_expired)) if @source.expired?
      raise ServiceError.new(generate_error_key(:was_declined)) if @source.declined?
      raise ServiceError.new(not_accessible_type) if @source.sign_and_send?
    end

    def check_member_accessible
      return if @source.owned_by_member?(@member)
      raise ServiceError.new(not_accessible_type)
    end

    def check_group_member_accessible
      check_member_accessible
    end

    def check_group_permission_accessible
      return
    end

  end
end
