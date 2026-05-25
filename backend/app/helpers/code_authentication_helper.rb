module CodeAuthenticationHelper

  # prepend_before_action
  def allow_code_authentication_strategy
    return unless params[:code].present?
    params[:task_id] ||= code_info['task_id']
    return unless access_token.nil?
    @authentication_strategy = :preview_code
  end

end
