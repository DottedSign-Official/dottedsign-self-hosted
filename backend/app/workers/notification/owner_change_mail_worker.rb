module Notification
  class OwnerChangeMailWorker < GeneralWorker
    def perform(source_id, source_type, old_owner_id, new_owner_id)
      @source = source_type.constantize.find_by(id: source_id)
      return if @source.nil?

      @old_owner = Member.find_by(id: old_owner_id)
      @new_owner = Member.find_by(id: new_owner_id)
      return if @old_owner.nil? || @new_owner.nil?

      old_owner_name = @old_owner.display_name
      new_owner_name = @new_owner.display_name
      new_owner_email = @new_owner.email
      task_name = @source.task_name

      recipient_infos.each do |info|
        MailCenter.delay.raise_if_server_failed(
          'owner_changed_notification',
          info[:email],
          info[:name],
          task_name,
          old_owner_name,
          new_owner_name,
          new_owner_email,
          info[:lang]
        )
      end
    end

    private

    def recipient_infos
      owner_infos = NotificationHelper.from_members([@old_owner, @new_owner])
      stage_infos = NotificationHelper.from_stages(@source.stages_for_notification(relevant_stage_ids))
      cc_infos = NotificationHelper.from_members(@source.cc_members)

      (owner_infos + stage_infos + cc_infos).compact.uniq { |info| info[:email] }
    end

    def relevant_stage_ids
      signer_active_status = ['processing', 'modifying']
      signer_done_status = ['signed', 'reviewed', 'done']
      reviewer_active_status = ['processing']
      reviewer_done_status = ['done']

      signer_statuses = signer_active_status + signer_done_status
      reviewer_statuses = reviewer_active_status + reviewer_done_status

      signer_stage_ids = sign_stages.where(status: signer_statuses).pluck(:id)
      reviewer_stage_ids = review_stages.where(status: reviewer_statuses).pluck(:id)

      signer_stage_ids + reviewer_stage_ids
    end

    def sign_stages
      return @source.dummy_stages.action_sign if @source.is_a?(Envelope)

      @source.sign_stages.action_sign
    end

    def review_stages
      return @source.dummy_stages.action_review if @source.is_a?(Envelope)

      @source.sign_stages.action_review
    end
  end
end
