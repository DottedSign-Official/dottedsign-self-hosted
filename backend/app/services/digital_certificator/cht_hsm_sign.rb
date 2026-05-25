module DigitalCertificator
  class ChtHsmSign < ServiceCaller
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
      apply_digital_certification
      @result = write_signed_data_to_file
    end

    private

    def apply_digital_certification
      resp = @custom_cert ? send("apply_#{@cert_type}") : apply_system_cert
      raise ServiceError.new(:digit_sign_failed, error_msg: resp.to_s) unless resp['status'] == 200
      raise ServiceError.new(:digit_sign_failed, error_msg: resp.to_s) unless resp['code'] == '0'
      record_digital_cert_apply_log(:successed)
      @signed_data = resp['msg']
    rescue => error
      record_digital_cert_apply_log(:failed, error_message: error.message)
      raise error
    end

    def apply_user_cert
      DigitalCertificate::Hsm.apply_user_cert(@input_path, @cert_info)
    end

    def apply_ap_cert
      DigitalCertificate::Hsm.apply_ap_cert(@input_path, @cert_info)
    end

    def apply_system_cert
      ap_info = DigitalCertificate::Gra.get_system_ap_info(task_id: @log_info[:task_id])
      DigitalCertificate::Hsm.apply_ap_cert(@input_path, ap_info)
    end

    def write_signed_data_to_file
      output_path = @input_path.sub(/.pdf$/, '_certed.pdf')
      File.open(output_path, 'wb+', encoding: 'ascii-8bit') do |f|
        f.write(Base64.decode64(@signed_data))
      end
      output_path
    end
  end
end
