module CheckHelper
  STORABLE_NAME_MAX_LENGTH = 255.freeze
  TAG_MAX_LENGTH = 255.freeze

  def security_checked
    return unless current_member.is_registered
    error_response(:need_to_check_security) unless current_member.confirmed?
  end

  def check_email(email = params[:email], check_options: [])
    checker = MailCheck.call(email, check_options: check_options)
    return error_response(checker.error.key, checker.error.message) if checker.failed?
  end

  # Format only when non-blank (same rules as MailCheck, without extra check_options).
  def check_email_if_present(email, check_options: [])
    email = email.to_s.strip
    return if email.empty?

    check_email(email, check_options: check_options)
  end

  def check_emails_if_present(emails, check_options: [])
    Array(emails).each do |e|
      check_email_if_present(e, check_options: check_options)
      break if performed?
    end
  end

  def check_ownership
    @envelope.present? ? check_envelope_ownership : check_task_ownership
  end

  def check_task_ownership
    error_response(:task_not_owned) unless @task.owner_id == current_member.id
  end

  def check_envelope_ownership
    error_response(:envelope_not_owned) unless @envelope.owner_id == current_member.id
  end

  def check_accessibility(check_action = 'view_task')
    @envelope.present? ? check_envelope_accessibility(check_action) : check_task_accessibility(check_action)
  end

  def check_task_accessibility(check_action = 'view_task')
    accessibility = @task.accessibility_of(current_member, check_action)
    error_response(accessibility) unless accessibility == :accessible
  end

  def check_envelope_accessibility(check_action = 'view_task')
    accessibility = @envelope.accessibility_of(current_member, check_action)
    error_response(accessibility) unless accessibility == :accessible
  end

  def check_available
    @envelope.present? ? check_envelope_available : check_task_available
  end

  def check_task_available
    error_response(:task_deleted) if @task.deleted?
  end

  def check_envelope_available
    error_response(:envelope_deleted) if @envelope.deleted?
  end

  def check_code_params_match!
    return unless @member_is_from_preview_code
    params[:sign_task_id] = params[:sign_task_id]&.to_i || @code_info['task_id']
    params[:envelope_id] = params[:envelope_id]&.to_i || @code_info['envelope_id']
    params[:stage_id] = @code_info['stage_id']&.to_i
    error_response(:code_not_match) if params[:sign_task_id] != @code_info['task_id'] || params[:envelope_id] != @code_info['envelope_id']
  end

  def check_stage_done!
    return unless @member_is_from_preview_code
    return if code_info['stage_id'].nil?
    stage_class = code_info['envelope_id'].present? ? DummyStage : SignStage
    stage = stage_class.find_by_id(code_info['stage_id'])
    return error_response(:stage_not_found) if stage.nil?
    if stage.done?
      member = Member.find_by(email: code_info['email'])
      error_response(:stage_already_done, nil, { signer_email: code_info['email'], viewable_attachments: StageViewableAttachments.call(stage.sign_task_id, stage.id, member.id).result })
    end
  end

  def check_acceptance!
    return unless @member_is_from_preview_code
    accept_info = RedisAssistant.read_and_retry("#{params[:code]}:quick_sign_accept")
    return error_response(:quick_sign_not_accepted, nil, task_detail_info) if accept_info.blank?
    return error_response(not_consent_error, nil, task_detail_info) unless accept_info[:client] == params[:client] && accept_info[:ip_address] == params[:ip_address] && accept_info[:work_id] == params[:work_id]
    @quick_sign_accept_at = accept_info[:accepted_at]
  end

  def check_cert_occassion
    params[:stages].each do |stage|
      stage[:verify].each do |stage_verify|
        return error_response(:invalid_cert_occassion) if VerifyMethod::CERT_TYPE.include?(stage_verify[:verify_type]) && stage_verify[:occassion] == "read"
      end if stage[:verify].present?
    end if params[:stages].present?
  end

  def check_signature_exist(sign_infos)
    values_by_type = sign_infos&.group_by { |info| info[:type] }.transform_values { |info| info.map { |i| i[:value] }.uniq } || {}
    values_by_type.slice('signature', 'guest_signature').each do |type, values|
      return error_response(:signature_not_found) if type.camelize.constantize.where(id: values).count != values.length
    end
  end

  def check_field_setting
    return unless params[:stages].present?
    params[:stages].each do |stage|
      visible_ca_count = stage[:xfdf_info].count { |field_setting| is_visible_ca_signature?(field_setting) }

      return error_response(:duplicate_visible_ca_setting) if visible_ca_count > 1
    end
  end

  def check_envelope_field_setting
    return unless params[:stages].present?
    params[:stages].each do |stage|
      check_visible_ca_setting(stage[:xfdf_info])
    end
  end

  def check_visible_ca_setting(xfdf_info)
    visible_ca_count_per_file = xfdf_info
      .select { |field_setting| is_visible_ca_signature?(field_setting) }
      .group_by { |field_setting| field_setting[:envelope_file_id] }
      .transform_values(&:size)
    return error_response(:duplicate_visible_ca_setting) if visible_ca_count_per_file.values.any? { |count| count > 1 }
  end

  def is_visible_ca_signature?(field_setting)
    field_setting[:field_type] == 'signature' && field_setting.dig(:options, :visible_ca)
  end

  def check_field_setting_group_params
    params[:stages]&.each do |stage_info|
      next if stage_info[:xfdf_info].blank?

      field_settings_by_file = stage_info[:xfdf_info]
        .select { |field_setting| field_setting[:field_group_object_id].present? }
        .group_by { |field_setting| field_setting[:envelope_file_id] || field_setting[:task_id] }

      field_groups_by_file = stage_info[:field_setting_groups]
        &.group_by { |field_group| field_group[:envelope_file_id] || field_group[:task_id] } || {}

      field_settings_by_file.each do |file_id, field_settings|
        field_setting_group_mapping = field_settings.group_by { |field_setting| field_setting[:field_group_object_id] }
        field_groups_for_file = field_groups_by_file[file_id] || []
        next if field_setting_group_mapping.blank? && field_groups_for_file.blank?

        invalid_field_group_object_ids = field_setting_group_mapping.keys - field_groups_for_file.pluck(:field_group_object_id)
        return error_response(:invalid_params, "invalid field_group_object_id, including (#{invalid_field_group_object_ids.join(', ')})") if invalid_field_group_object_ids.present?

        validate_field_setting_groups(field_groups_for_file, field_setting_group_mapping)
      end
    end
  end

  def check_and_setup_template(check_action = 'view')
    @template = Template.find_by_id(params[:template_id] || params[:id])
    return error_response(:template_not_found) if @template.nil?
    return error_response(:template_deleted) if @template.deleted?
    return error_response(:template_not_accessible) unless @template.accessibility_of(current_member, check_action) == :accessible
  end

  def check_member_manage_group
    return error_response(:invalid_member_management_group) unless current_member.manage_group?(current_member.group_id)
  end

  def check_group_admin
    return error_response(:member_not_group_admin) unless current_member.admin_of_group?(current_member.group_id)
  end

  def check_owner_template
    return error_response(:not_owner) unless @template.owned_by_member?(current_member)
  end

  def check_template_share_group_accessible
    return error_response(:invalid_permission) unless GROUP_TEMPLATE_SHARE_ENABLE
  end

  def check_expired!(source = nil)
    source ||= @envelope.present? ? @envelope : @task
    return unless source.draft? || source.waiting?
    source.update(status: SignTask.statuses[:expired]) if source.setting&.deadline &.< Time.zone.now
  end

  def check_task_expired!
    check_expired!(@task)
  end

  def check_envelope_expired!
    check_expired!(@envelope)
  end

  def check_storable_name(storable_name = params[:file_name])
    return if storable_name.nil?
    return error_response(:invalid_name) if storable_name.blank? || storable_name.size > STORABLE_NAME_MAX_LENGTH
  end

  def check_task_category
    return error_response(:category_not_allow) if SignTask::ALLOW_CATEGORIES.exclude?(params[:category])
  end

  private

  def validate_field_setting_groups(field_setting_groups, field_setting_group_mapping)
    field_setting_groups.each do |field_group_params|
      field_settings_in_group = field_setting_group_mapping[field_group_params[:field_group_object_id]]
      min_quantity = Settings.default.field_group_options.dig(field_group_params[:field_group_type], 'min_quantity')
      return error_response(:invalid_params, 'invalid number of field_settings in a group') if field_settings_in_group.nil? || (min_quantity.present? && field_settings_in_group.size < min_quantity)
      return error_response(:invalid_params, 'invalid field_type in a group') if (field_settings_in_group.pluck(:field_type).uniq - [field_group_params[:field_group_type]]).present?
      concrete_field_group = FieldSettingGroup.find_sti_class(field_group_params[:field_group_type]).new(options: field_group_params[:options] || {})
      concrete_field_group.validate_options(field_setting_options: field_settings_in_group.pluck(:options).compact)
      return error_response(:invalid_params, "invalid field_setting_group options, including (#{concrete_field_group.errors[:options].join(' && ')})") if concrete_field_group.errors[:options].present?
    end
  end

end
