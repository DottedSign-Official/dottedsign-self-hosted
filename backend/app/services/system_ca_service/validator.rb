module SystemCaService
  class Validator < ServiceCaller
    def initialize(system_ca)
      @system_ca = system_ca
    end

    def call
      file = Rails.root.join('public', 'system_ca_validate.pdf')
      resp = DigitalCertificate::Hsm.apply_ap_cert(file, @system_ca.cert_info)
      raise ServiceError.new(:digit_sign_failed) unless resp['status'] == 200 && resp['code'] == '0'
    end
  end
end