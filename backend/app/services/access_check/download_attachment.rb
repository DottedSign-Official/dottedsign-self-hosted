module AccessCheck
  class DownloadAttachment < General

    def set_check_action(check_action)
      @check_action = 'view_task'
    end

    def check_source_accessible
      super
      raise ServiceError.new(not_accessible_type) unless @source.completed?
    end

    def check_member_accessible
      return if @source.owned_by_member?(@member)
      raise ServiceError.new(not_accessible_type) if @source.is_dummy?
    end

    def check_group_member_accessible
      return if @source.owned_by_member?(@member)
      raise ServiceError.new(not_accessible_type) if @source.is_dummy?
    end

    def check_group_permission_accessible
      return if @source.owned_by_member?(@member) && @group_permission["download_completed_task_self_sender"]
      return if @source.acted_by_member?(@member) && @group_permission["download_completed_task_self_signer"]
      return if @source.owned_by_group_others?(@member) && @group_permission["download_completed_task_group_sender"]
      return if @source.acted_by_group_others?(@member) && @group_permission["download_completed_task_group_signer"]
      raise ServiceError.new(not_accessible_type)
    end
  end
end
