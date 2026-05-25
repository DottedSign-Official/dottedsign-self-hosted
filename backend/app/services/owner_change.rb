class OwnerChange < ServiceCaller
  def initialize(change_info, source:, actor:)
    @source = source
    @new_owner_email = change_info[:new_owner][:email]
    @new_owner = nil
    @actor = actor
  end

  def call
    setup_old_owner
    setup_new_owner
    check_accessibility
    check_transfer_validations
    do_transfer!
    record_change_log
    send_notify_mail if @source.waiting?
  end

  private

  def setup_old_owner
    @old_owner = @source.owner
  end

  def setup_new_owner
    @new_owner = Member.find_by(email: @new_owner_email, is_registered: true)
    raise ServiceError.new(:member_not_found) if @new_owner.nil?
  end

  def check_accessibility
    accessibility = @source.accessibility_of(@actor, 'change_owner')
    raise ServiceError.new(accessibility) unless accessibility == :accessible
  end

  def check_transfer_validations
    raise ServiceError.new(:owner_is_equal) if @source.owner == @new_owner

    # Group validation if actor belongs to a group
    if @actor.group.present?
      raise ServiceError.new(:not_group_member) if @source.owner.group != @new_owner.group
    end
  end

  def do_transfer!
    @source.transfer_owner!(new_owner: @new_owner)
    @result = { new_owner: @new_owner.display_name }
  end

  def record_change_log
    other_info = { old_owner: @old_owner.id, new_owner: @new_owner.id }
    other_info.merge!(old_group_id: @old_owner.group_id, new_group_id: @new_owner.group_id)
    @source.add_sign_event('owner_changed', @actor.id, stage_info: {}, client_info: {}, other_info: other_info)
  end

  def send_notify_mail
    Notification::OwnerChangeMailWorker.perform_async(@source.id, @source.class.name, @old_owner.id, @new_owner.id)
  end
end
