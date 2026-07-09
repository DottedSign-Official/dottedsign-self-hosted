module ParamsHelper

  def set_user_agent
    params[:user_agent] ||= request.user_agent
  end

  def strict_boolean(expected_boolean_value)
    ActiveRecord::Type::Boolean.new.serialize(expected_boolean_value)
  end

  def format_time_range
    return if params[:start_from].blank? || params[:end_at].blank?
    Time.parse(params[:start_from]).beginning_of_day..Time.parse(params[:end_at]).end_of_day
  end

  def client_params
    params.permit(:client, :ip_address, :user_agent, :work_id, :code)
  end

  def setting_params(setting_class)
    process_setting_params(params)
    [
      :inform_enable, :forget_remind, :deadline, :message, :completed_message, :expire_remind_at, :need_otp_verify, :receiver_lang, :need_ca,
      *setting_class.extra_permitted_attributes,
      cc_info: [:email, :name], reference_setting: reference_attrs, completed_reference_setting: reference_attrs
    ]
  end

  def task_setting_params
    params.permit(*setting_params(TaskSetting))
  end

  def envelope_setting_params
    params.permit(*setting_params(EnvelopeSetting))
  end

  def template_setting_params
    params.permit(*setting_params(TemplateSetting))
  end

  def pagination_params
    params.permit(:page, :per_page)
  end

  def time_zone
    TimezoneMapping[:zone_hour][TimezoneMapping[:hour_zone][params.require(:zone).to_f]]
  end

  def template_create_task_info
    params.permit(:file_name, :has_order, stages: [:email, :name, :role, verify: verify_attrs, stage_setting: stage_setting_attrs, custom_message_setting: custom_message_setting_attrs])
  end

  def task_list_filter_params
    require_attrs = [:search_email, :search_task_id, :search_envelope_id, :start_from, :end_at, :search_task_status, :search_ca_status, :page, :per_page]
    params.permit(*require_attrs)
  end

  def process_source_params
    params[:stages].each do |stage_params|
      stage_params[:action] ||= 'sign'
      next unless stage_params[:action] == 'review'
      stage_params[:pdf_object_info] = []
      stage_params[:xfdf_info] = []
      stage_params[:attachment_setting] = []
      stage_params[:custom_message_setting] = {}
      stage_params[:verify] = []
      stage_params[:stage_setting] = nil
    end if params[:stages].present?
  end

  def check_task_params
    return if params[:stages].blank?
    check_stage_action('SignTask', params[:stages])
    check_stage_field_settings(params[:stages])
  end

  def check_envelope_params
    return if params[:stages].blank?
    check_stage_field_settings(params[:stages])
  end

  def check_template_params
    return if params[:stages].blank?
    check_stage_action('Template', params[:stages])
    check_stage_field_settings(params[:stages])
  end

  def require_one_of(*keys)
    unless keys.any? { |key| params[key].present? }
      raise ActionController::ParameterMissing.new(keys.join(' or '))
    end
  end

  private

  def process_setting_params(params)
    params[:forget_remind] = current_member.forget_remind if params[:forget_remind].nil?
    params[:deadline] = Time.at(params[:deadline]) if params[:deadline].present?
    if params[:expire_remind]
      params[:remind_days_before_expire] ||= current_member.remind_days_before_expire
      params[:expire_remind_at] = params[:deadline] - params[:remind_days_before_expire].days if params[:remind_days_before_expire] > 0
    else
      params[:expire_remind_at] = nil
    end
    params[:need_ca] = Settings.default.ca.ca_enable if params[:need_ca].nil?
    params[:receiver_lang] ||= current_member.receiver_lang
  end

  def check_stage_action(source_type, stages)
    return error_response(:invalid_params, error_message: 'review stage should be after sign stage') if stages[0][:action] == 'review'
    return if source_type == 'Template'
    reviewer_emails = []
    stages[1..].each_with_index do |stage, index|
      if stage[:action] == 'sign'
        reviewer_emails = []
      elsif stage[:action] == 'review'
        return error_response(:invalid_params, "duplicate review stage after stage #{index}") if reviewer_emails.include?(stage[:email])
        reviewer_emails << stage[:email]
      end
    end
  end

  def check_stage_field_settings(stages)
    stages.each do |stage_params|
      option_errors = check_field_setting_batch_params(stage_params[:xfdf_info])
      return error_response(:invalid_params, error_message: "invalid field_setting options, including (#{option_errors.join(' && ')})") if option_errors.present?
    end
  end

  def check_field_setting_batch_params(field_settings)
    field_settings.each do |params|
      concrete_field = FieldSetting.find_sti_class(params[:field_type]).new(options: params[:options] || {})
      concrete_field.validate_options
      return concrete_field.errors[:options] if concrete_field.errors[:options].present?
    end
    []
  end

end
