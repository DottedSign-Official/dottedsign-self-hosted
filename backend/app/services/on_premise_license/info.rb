module OnPremiseLicense
  class Info < ServiceCaller
    attr_reader :license

    def call
      verify_license
      @result = license_info
    end

    private

    def verify_license
      verify = OnPremiseLicense::Verify.call(LICENSE_KEY)
      raise ServiceError.new(verify.error.key) if verify.failed?
      @license = verify.license
    end

    def license_info
      restrictions = @license&.restrictions
      {
        expires_at: @license&.expires_at,
        group_enable: restrictions[:group_enable],
        plan: restrictions[:plan],
        template: template_license(restrictions[:template]),
        sign_task: restrictions[:sign_task],
        otp_verify: otp_verify_license(restrictions[:otp_verify]),
        authenticate_member: restrictions[:authenticate_member],
        certificate_authority: certificate_authority_license(restrictions[:certificate_authority])
      }
    end

    def template_license(restriction)
      return if restriction.nil?
      restriction["group_share"] = GROUP_TEMPLATE_SHARE_ENABLE
      restriction
    end

    def otp_verify_license(restriction)
      return if restriction.nil?
      restriction["cht_cert_enable"] = false unless Settings.default.ca.ca_enable
      restriction
    end

    def certificate_authority_license(restriction)
      return if restriction.nil?
      restriction["system_ca_enable"] = SYSTEM_CA_USE
      restriction["system_ca_enable"] = false unless Settings.default.ca.ca_enable
      restriction
    end

  end
end
