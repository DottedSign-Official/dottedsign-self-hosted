class CaAuthenticator < ServiceCaller

  def initialize(email, cert_type, cache_info: nil)
    @email = email
    @cert_type = cert_type
    @cache_info = cache_info || {}
    @envelope_info = cache_info[:envelope_info] || {}
  end

  def call
    set_member
    check_ca
    request_for_ca
    apply_new_ca if @ca_need_apply
  end

  private

  def set_member
    @member = Member.find_by_email(@email)
    raise ServiceError.new(:member_not_found) if @member.nil?
  end

  def check_ca
    @cert_personal = @cert_type.include?('personal')
  end

  def request_for_ca
    path_version = @envelope_info.present? ? 'v2' : 'v1'
    request = DigitalCertificate::Gra.auth_ca(@email, personal: @cert_personal, envelope_info: @envelope_info, path_version: path_version)
    case request['result']
    when 1
      cache_ca_request_info(request['tid']) if @cache_info.present?
      @result = { state: :waiting_for_auth, tid: request['tid'] }
    when 13008 # 不存在有效的憑證
      @discount_code = request['discountCode']
      @ca_need_apply = true
    when 11010 # 憑證類型或憑證效期參數錯誤或尚未授權
      raise ServiceError.new(:request_ca_failed, error_obj: request)
    else
      raise ServiceError.new(:request_ca_failed, error_obj: request)
    end
  end

  def apply_new_ca
    apply = DigitalCertificate::Gra.apply_ca(@email, @discount_code, personal: @cert_personal)
    if apply['result'] == 1
      Rails.cache.write("ca_apply:#{@discount_code}", @cache_info, expires_in: VerifyMethod::CERT_INTERVAL)
      @result = { state: :waiting_for_apply, apply_url: apply['url'], discount_code: @discount_code }
    else
      raise ServiceError.new(:apply_ca_failed, error_obj: apply)
    end
  end

  def cache_ca_request_info(tid)
    Rails.cache.write("ca_request:#{tid}", @cache_info, expires_in: VerifyMethod::CERT_INTERVAL)
    return if @cache_info[:uuid].blank?
    verify_method = VerifyMethod.find_by_uuid(@cache_info[:uuid])
    Rails.cache.write("#{verify_method.stage_type}:#{verify_method.stage_id}:verify_source", { cht: "", tid: tid }, expires_in: VerifyMethod::CERT_INTERVAL) if verify_method.present?
  end

end
