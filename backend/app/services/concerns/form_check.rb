module FormCheck
  FORBIDDEN_ENCRYPTABLE_SETTING_KEYS = %i[is_encrypted completion_password].freeze

  def check_form_info
    check_form_template
    check_form_name_and_description
    check_form_signer_infos
    check_forbidden_encryptable_settings
  end

  def check_form_template
    raise ServiceError.new(:template_deleted) if @template.deleted?
    raise ServiceError.new(:form_template_not_usable) if @public_form.present? && @public_form.terminated?
    raise ServiceError.new(:form_template_not_usable) unless @template.accessibility_of(@owner, check_usage: false) == :accessible
  end

  def check_form_name_and_description
    raise ServiceError.new(:invalid_form_info, error_message: 'form name is more than 500 characters') if @form_info[:form_name].present? && @form_info[:form_name].length > 500
    raise ServiceError.new(:invalid_form_info, error_message: 'form description is more than 500 characters') if @form_info[:description].present? && @form_info[:description].length > 500
  end

  def check_form_signer_infos
    # not allow reviewers in public form currently
    raise ServiceError.new(:invalid_form_info, error_message: 'reviewers are not allowed') if @template.dummy_stages.any?(&:action_review?)
    template_stages_count = @template_info.present? ? @template_info[:stages].length : @template.dummy_stages.count
    raise ServiceError.new(:invalid_form_info, error_message: 'the number of signer_infos does not match the number of template stages') unless @form_info[:signer_infos].length == template_stages_count
    first_signer_info = @form_info[:signer_infos].first
    raise ServiceError.new(:invalid_form_info, error_message: 'first signer should be form signer') unless first_signer_info[:signer_type] == 'form_signer'
    should_be_normal_signer = false
    stages = @template.dummy_stages.select(:id, :source_id, :source_type, "actor_info ->> 'role' as role").includes(:verify_methods)
    stage_ids = stages.map(&:id)
    form_signer_nums = 1
    @form_info[:signer_infos].each_with_index do |signer_info, index|
      stage = stages[index]
      signer_info[:role] = stage.role
      raise ServiceError.new(:invalid_form_info, error_message: 'all form signers should be in front of normal signers') if should_be_normal_signer && signer_info[:signer_type] == 'form_signer'
      verify_types = stage.verify_methods.pluck(:verify_type)
      if signer_info[:signer_type] == 'form_signer'
        form_signer_nums += 1
        raise ServiceError.new(:invalid_form_info, error_message: 'requisite.email of a form signers should be required when the verify type is email') if verify_types.include?('email') && signer_info[:requisite][:email] != 'required'
      elsif signer_info[:signer_type] == 'normal_signer'
        should_be_normal_signer ||= true
        next if verify_types.exclude?('sms')
        raise ServiceError.new(:invalid_phone) if invalid_phone?(signer_info[:phone])
      end
    end
    raise ServiceError.new(:invalid_form_info, error_message: 'form signer can not be a reviewer') if (stage_ids.take(form_signer_nums) && check_related_stage_ids).present?
  end

  def check_related_stage_ids
    @template.dummy_stages.action_review.pluck(:id, :actor_info).flat_map do |id, actor_info|
      [id, actor_info['base_stage_id']]
    end.compact.uniq
  end

  def invalid_phone?(phone_num)
    return true if phone_num.nil?
    normalize_phone_number = phone_num.scan(/\d+/).join('')
    !Phonelib.parse(normalize_phone_number).valid?
  end

  def check_forbidden_encryptable_settings
    return unless forbidden_encryptable_setting_keys_present?

    raise ServiceError.new(:invalid_params, error_message: 'public form does not support encryptable settings')
  end

  def forbidden_encryptable_setting_keys_present?
    FORBIDDEN_ENCRYPTABLE_SETTING_KEYS.any? { |key| @setting_info.key?(key) || @setting_info.key?(key.to_s) }
  end
end
