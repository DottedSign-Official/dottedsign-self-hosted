module DigitalCertificator
  class PdfSign < ServiceCaller
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
      sign
      @result = @output_path
    end

    private

    def sign
      provider = Settings.digital_signature.provider
      provider_class = "DigitalCertificator::#{provider.camelize}Sign".safe_constantize
      raise ServiceError.new(:invalid_params, error_msg: 'invalid digital signature provider') if provider_class.nil?
      signer = provider_class.call(@input_path, custom_cert: @custom_cert, cert_type: @cert_type, cert_info: @cert_info, log_info: @log_info)
      raise signer.error if signer.failed?
      @output_path = signer.result
    end
  end
end
