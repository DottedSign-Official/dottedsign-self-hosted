module DigitalCertificator
  class PsigSign < ServiceCaller
    include DigitalCertLog
    include CommandExecute

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
      apply_digital_certification
      @result = @output_path
    end

    private

    def apply_digital_certification
      send("apply_#{@cert_type}")
      record_digital_cert_apply_log(:successed)
    rescue => error
      record_digital_cert_apply_log(:failed, error_message: error.message)
      raise error
    end

    def apply_user_cert
      sign_with_psig(@cert_info)
    end

    def apply_ap_cert
      sign_with_psig(@cert_info)
    end

    def apply_system_cert
      ap_info = DigitalCertificate::Psig.default_sign_info
      sign_with_psig(ap_info)
    end

    def sign_with_psig(sign_info)
      @output_path = generate_output_path
      resp = DigitalCertificate::Psig.sign(@input_path, @output_path, sign_info, pdf_password: @cert_info[:password])
      raise ServiceError.new(:digit_sign_failed, error_msg: resp.to_s) if command_failed?(resp, failed_regex: /stderr/)
    end

    def generate_output_path
      @input_path.sub(/.pdf$/, '_certed.pdf')
    end
  end
end
