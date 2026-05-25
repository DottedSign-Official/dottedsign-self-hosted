module PublicForms::CheckHelper

  REQUISITES = ['required', 'optional'].freeze

  def check_and_setup_form
    @form ||= PublicForm.find_by(id: params[:form_id])
    @form ||= PublicForm.find_by(uuid: params[:form_uuid])
    raise ErrorResponse::RequestError.new(:form_not_found) if @form.nil?
    raise ErrorResponse::RequestError.new(:form_is_deleted) if @form.is_deleted
  end

  def check_and_setup_owned_form
    check_and_setup_form
    raise ErrorResponse::RequestError.new(:form_not_owned) unless @form.owner_id == current_member.id
  end

  def check_form_params
    raise ErrorResponse::RequestError.new(:invalid_params, error_message: 'invalid status') if params[:status].present? && PublicForm::AVAILABLE_STATUSES.exclude?(params[:status].to_sym)
    raise ErrorResponse::RequestError.new(:invalid_params, error_message: 'invalid goal_num') if params[:goal_num] < 1 && params[:goal_num] != -1
    raise ErrorResponse::RequestError.new(:invalid_params, error_message: 'invalid end_at') if params[:end_at] < Time.current.change(sec: 0).to_i && params[:end_at] != -1
    params[:signer_infos]&.each do |signer_info|
      if signer_info[:requisite].present?
        raise ErrorResponse::RequestError.new(:invalid_params, error_message: 'invalid requisite name') unless signer_info[:requisite][:name].nil? || REQUISITES.include?(signer_info[:requisite][:name])
        raise ErrorResponse::RequestError.new(:invalid_params, error_message: 'invalid requisite email') unless signer_info[:requisite][:email].nil? || REQUISITES.include?(signer_info[:requisite][:email])
        raise ErrorResponse::RequestError.new(:invalid_params, error_message: 'invalid requisite, required needed') unless signer_info[:requisite].values.include?('required')
      end
    end
  end

  def check_signer_email
    check_email(params[:signer_email]) if params[:signer_email].present?
  end
end
