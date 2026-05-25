module AccessCheck
  class DownloadTask < General

    def set_check_action(check_action)
      @check_action = 'view_task'
    end

    def check_group_permission_accessible
      if @source.sign_and_send?
        check_group_member_download_sign_and_send_task
      elsif @source.completed?
        check_group_member_download_remote_task('completed')
      else
        check_group_member_download_remote_task('processing')
      end
    end

    private

    def check_group_member_download_sign_and_send_task
      return if @source.owned_by_member?(@member) && @group_permission['download_sign_and_send_self_task']
      return if @source.owned_by_group_others?(@member) && @group_permission['download_sign_and_send_group_task']
      raise ServiceError.new(not_accessible_type)
    end

    def check_group_member_download_remote_task(task_status)
      return if @source.owned_by_member?(@member) && @group_permission["download_#{task_status}_task_self_sender"]
      return if @source.acted_by_member?(@member) && @group_permission["download_#{task_status}_task_self_signer"]
      return if @source.owned_by_group_others?(@member) && @group_permission["download_#{task_status}_task_group_sender"]
      return if @source.acted_by_group_others?(@member) && @group_permission["download_#{task_status}_task_group_signer"]
      raise ServiceError.new(not_accessible_type)
    end

  end
end
