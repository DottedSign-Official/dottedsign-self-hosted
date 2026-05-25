class ApplicationController < ActionController::API
  include CheckHelper
  include ParamsHelper
  include ResponseHelper

  before_action :check_license
  prepend_before_action :set_user_agent

  rescue_from Exception do |e|
    error_response(:internal_server_error, "#{e.message} (#{e.backtrace.first})")
  end

  rescue_from ActionController::ParameterMissing do |e|
    error_response(:need_more_information, "#{e.message} (#{e.backtrace.first})")
  end

  rescue_from JWT::DecodeError do |e|
    error_response(:invalid_preview_code)
  end

  rescue_from ErrorResponse::RequestError do |e|
    error_response(e.key, e.error_message, e.error_data)
  end

  def doorkeeper_unauthorized_render_options(opts)
    error_response = ErrorResponse.to_api(:invalid_grant, opts[:error].description)
    { json: error_response[:json] }
  end

  def doorkeeper_forbidden_render_options(opts)
    error_response = ErrorResponse.to_api(:doorkeeper_forbidden, opts[:error].description)
    { json: error_response[:json] }
  end

  def append_info_to_payload(payload)
    super
    payload[:email] = @current_member&.email
    payload[:member_id] = @current_member&.id
    payload[:error_response] = JSON.parse(response.body) rescue response.body if response.status != 200
  end

  private

  def current_member
    @current_member
  end

  def access_token
    return @access_token if @access_token.present?
    @access_token, _options = ActionController::HttpAuthentication::Token.token_and_options(request)
    @access_token
  end

  def setup_current_member(optional: false)
    return @current_member if @current_member.present? && @current_member.active?
    @authentication_strategy ||= :access_token
    send("setup_member_from_#{@authentication_strategy.to_s}")
    return error_response(:invalid_token) if current_member.nil? && optional == false
    return error_response(:member_inactive) if @current_member&.inactive?
  rescue ServiceError => e
    return error_response(e.key, e.message)
  end

  def setup_member_from_access_token
    raise ServiceError.new(:invalid_token) if access_token.nil?
    token = Doorkeeper::AccessToken.find_by_token(access_token)
    raise ServiceError.new(:invalid_member) if token.blank?
    @current_member = Member.find_by_id(token.resource_owner_id)
    raise ServiceError.new(:invalid_member) if @current_member.blank?
    I18n.locale = @current_member.i18n_locale
  end

  def setup_member_from_preview_code
    raise ServiceError.new(:invalid_request) unless params[:code].present?
    @member_is_from_preview_code = true
    @current_member = Member.find_by_email(code_info['email'])
    raise ServiceError.new(:invalid_member) if @current_member.nil?
    raise ServiceError.new(:login_required) if @current_member.is_registered
    raise ServiceError.new(:code_expire) if code_info['expired_at'].present? && code_info['expired_at'] < Time.now.to_i
  end

  def code_info
    return @code_info if @code_info.present?
    @code_info, _header = JWT.decode(params[:code], Secrets.jwt.secret, true, { algorithm: Secrets.jwt.encode_algorithm })
    @code_info
  end

  def check_license
    return if Rails.env.test?
    return unless OnPremiseLicense::PlanReader.enterprise?

    verify = OnPremiseLicense::Verify.call(LICENSE_KEY)
    error_response(verify.error.key) if verify.failed?
  end

end
