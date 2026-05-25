module AccessCheck
  class DownloadAuditTrail < General

    def set_check_action(check_action)
      @check_action = 'view_task'
    end

    def check_source_accessible
      super
      return if @source.completed? || @source.declined?
      raise ServiceError.new(generate_error_key(:is_not_finished))
    end

    def check_group_permission_accessible
      return if @source.owned_by_member?(@member) && @group_permission["download_audit_trail_self_sender"]
      return if @source.acted_by_member?(@member) && @group_permission["download_audit_trail_self_signer"]
      return if @source.owned_by_group_others?(@member) && @group_permission["download_audit_trail_group_sender"]
      return if @source.acted_by_group_others?(@member) && @group_permission["download_audit_trail_group_signer"]
      raise ServiceError.new(not_accessible_type)
    end

  end
end
