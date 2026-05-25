module AccessCheck
  class DeleteTask < General

    def check_source_accessible
      super
      raise ServiceError.new(generate_error_key(:not_deletable)) unless @source.deletable?
    end

    def check_member_accessible
      return if @source.owned_by_member?(@member)
      raise ServiceError.new(not_accessible_type)
    end

    def check_group_member_accessible
      return if @source.owned_by_member?(@member)
      raise ServiceError.new(not_accessible_type)
    end

    def check_group_permission_accessible
      if @source.sign_and_send?
        raise ServiceError.new(not_accessible_type) unless @group_permission["delete_sign_and_send_self_task"]
      else
        raise ServiceError.new(not_accessible_type) unless @group_permission["delete_processing_task_self_sender"]
      end
    end

  end
end
