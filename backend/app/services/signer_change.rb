class SignerChange < ServiceCaller

  def initialize(stage_info, member_id, change_info, client_info: {})
    @stage_id = stage_info[:stage_id]
    @stage_type = stage_info[:stage_type]
    @member_id = member_id
    @change_signer_info = change_info[:new_signer]
    @change_reason = change_info[:reason]
    @client_info = client_info
  end

  def call
    setup_and_check_member!
    setup_and_check_source!
    check_source_accessibility!
    check_change_email!
    setup_new_member
    change_signer
    record_change_log
    record_contact_list
    send_notify
    @result = { "#{@source.class.name.underscore}_id" => @source.id }
  end

  private

  def setup_and_check_member!
    @member = Member.find_by_id(@member_id)
    raise ServiceError.new(:member_not_found) if @member.nil?
  end

  def setup_and_check_source!
    @stage = @stage_type.constantize.find_by_id(@stage_id)
    raise ServiceError.new(:stage_not_found) if @stage.nil?
    @source = @stage.source
    @old_member = @stage.actor
    @effected_stages = @source.is_a?(SignTask) ? [] : SignStage.specific_sequence_in_envelope(@source.id, @stage.sequence).to_a
  end

  def check_source_accessibility!
    accessibility = @source.accessibility_of(@member, 'change_signer', check_stage: @stage)
    raise ServiceError.new(accessibility) unless accessibility == :accessible
  end

  def check_change_email!
    @change_signer_info[:email].strip!
    return if @source.has_order
    include_emails = @source.stages.pluck(:email)
    raise ServiceError.new(:forward_mail_already_in_flow) if include_emails.include?(@change_signer_info[:email])
  end

  def setup_new_member
    @new_member = Member.setup_member(@change_signer_info[:email], @change_signer_info[:name])
  end

  def change_signer
    send("#{@stage_type.underscore}_change_signer", @stage)
    @effected_stages.each { |stage| sign_stage_change_signer(stage) }
  end

  def sign_stage_change_signer(sign_stage)
    verify_sms_method = sign_stage.verify_methods.find_by(verify_type: "sms")
    verify_sms_method.update(verify_source: @change_signer_info[:phone]) if @change_signer_info[:phone].present?
    sign_stage.email = @change_signer_info[:email]
    sign_stage.actor_name = @change_signer_info[:name]
    sign_stage.group_id = @new_member.group_id if GROUP_USE
    common_change_signer(sign_stage)
  end

  def dummy_stage_change_signer(dummy_stage)
    dummy_stage.actor_info = { email: @change_signer_info[:email], name: @change_signer_info[:name] }
    common_change_signer(dummy_stage)
  end

  def common_change_signer(stage)
    stage.actor_id = @new_member.id
    stage.save!
    stage.stage_setting.specified_lang = @change_signer_info[:lang]
    stage.stage_setting.save!
  end

  def record_change_log
    other_info = { old_email: @old_member.email, new_email: @stage.email, reason: @change_reason }
    if GROUP_USE
      other_info[:old_group_id] = @old_member.group_id
      other_info[:new_group_id] = @new_member.group_id
    end
    @source.add_sign_event('signer_changed', @member_id, stage_info: @stage.basic_info, client_info: @client_info, other_info: other_info)
    @effected_stages.each do |stage|
      stage.source.add_sign_event('signer_changed', @member_id, stage_info: stage.basic_info, client_info: @client_info, other_info: other_info)
    end
  end

  def record_contact_list
    Contact.setup_for_member(@member_id, @change_signer_info)
  end

  def send_notify
    mail_notify
    # TODO: adjust socket event notify
    event_notify if @source.is_a?(SignTask)
  end

  def mail_notify
    Notification::ProcessingMailWorker.perform_async(@stage.id, @stage_type) if @stage.processing? && @source.need_inform?
    token = @source.original_file.preview_code(will_expired: false, default_member_email: @source.owner.email)
    update_execute_by = @source.owner_id == @member_id ? :self : :other
    disable_execute_by = @old_member.id == @member_id ? :self : :other
    owner_receiver_lang = @source.mail_lang_for(@source.owner)
    old_member_receiver_lang = @source.mail_lang_for(@old_member)
    MailCenter.delay.raise_if_server_failed('task_update', @source.owner.email, @source.owner.display_name, @source.file_name, token, @old_member.display_name, @old_member.email, @change_signer_info[:name], @change_signer_info[:email], update_execute_by, @change_reason, owner_receiver_lang)
    MailCenter.delay.raise_if_server_failed('task_disable', @old_member.email, @old_member.display_name, @source.file_name, @member.email, @member.display_name, @change_signer_info[:name], @change_signer_info[:email], disable_execute_by, old_member_receiver_lang)
  end

  def event_notify
    notify_member_ids = @source.related_member_ids
    SocketCenter.broadcast_to_many(notify_member_ids, event: 'task_forward', payload: { task_id: @source.id })
    notify_member_ids.each do |member_id|
      NotificationCenter.delay.raise_if_server_failed('target_push', 'task_forward', member_id, event_user: @member.display_name, doc_name: @source.file_name, new_signer: @stage.email, share_link: @source.preview_share_link)
    end
  end

end
