module PublicForms::FormTokenAuthenticationHelper
  # prepend_before_action
  def allow_form_token_authentication_strategy
    return unless access_token.nil? && params[:form_token].present?
    @authentication_strategy = :form_token
  end

  # dynamic binding by authentication_strategy from AuthenticationHelper
  def setup_member_from_form_token
    error_response(:code_expire) if token_expired?
    @current_member = Member.find_by_email(Settings.system_members.form_signer)
  end

  def token_info
    return @token_info if @token_info.present?
    @token_info, _header = JWT.decode(params[:form_token], Secrets.jwt.secret, true, { algorithm: Secrets.jwt.encode_algorithm })
    @token_info
  end

  private

  def token_expired?
    token_info['expired_at'].present? && token_info['expired_at'] < Time.now.to_i
  end
end
