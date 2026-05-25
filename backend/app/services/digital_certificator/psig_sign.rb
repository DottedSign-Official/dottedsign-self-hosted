module DigitalCertificator
  class PsigSign < ServiceCaller
    include DigitalCertLog

    attr_reader :working_dir

    def initialize(input_path, custom_cert: false, cert_type: 'ap_cert', cert_info: {}, log_info: {})
      @working_dir = File.dirname(input_path)
      @input_path = input_path
      @custom_cert = custom_cert
      @cert_type = cert_type
      @cert_info = cert_info
      @log_info = log_info
    end

    def call
      @result = apply_digital_certification
    end

    private

    def apply_digital_certification
      params = {
        input_file: @input_path,
        cert_type: @cert_type,
      }.merge(@cert_info).merge(@log_info)
      psig_signer = Psig::Sign.call(params)
      raise psig_signer.error if psig_signer.failed?
      record_digital_cert_apply_log(:successed)
      psig_signer.result
    rescue => error
      record_digital_cert_apply_log(:failed, error_message: error.message)
      raise error
    end
  end
end
