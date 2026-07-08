module DigitalCertificator
  class ChtHsmFieldSign < ServiceCaller
    include DigitalCertLog

    def initialize(file_path, image_path, field_info, custom_cert: false, system_ca: nil, cert_type: 'user_cert', cert_info: {}, log_info: {}, working_dir: nil)
      @file_path = file_path
      @image_path = image_path
      @field_info = field_info
      @custom_cert = custom_cert
      @system_ca = system_ca
      @cert_type = cert_type
      @cert_info = cert_info
      @log_info = log_info
      @working_dir = working_dir || File.dirname(file_path)
    end

    def call
      process = ImageProcess.call(@image_path, @field_info[:coords], @field_info[:field_size], @field_info[:page_info])
      raise process.error if process.failed?
      signed_data = apply_digital_certification(process.result)
      @result = write_signed_data_to_file(signed_data)
    end

    private

    def apply_digital_certification(image_info)
      resp = if @cert_type == 'user_cert'
               DigitalCertificate::Hsm.apply_user_visible_cert(@file_path, image_info.delete(:path), image_info, @cert_info)
             else
               ap_info = resolve_ap_info
               DigitalCertificate::Hsm.apply_ap_visible_cert(@file_path, image_info.delete(:path), image_info, ap_info)
             end
      raise ServiceError.new(:digit_sign_failed, error_message: resp.to_s) unless resp['status'] == 200
      raise ServiceError.new(:digit_sign_failed, error_message: resp.to_s) unless resp['code'] == '0'
      record_digital_cert_apply_log(:successed)
      resp['msg']
    rescue => error
      record_digital_cert_apply_log(:failed, error_message: error.message)
      raise error
    end

    def resolve_ap_info
      if @system_ca.present?
        @system_ca.cert_info.merge!(long_id: @cert_info[:long_id])
      elsif @custom_cert
        @cert_info
      else
        DigitalCertificate::Gra.get_system_ap_info(task_id: @log_info[:task_id])
      end
    end

    def write_signed_data_to_file(signed_data)
      return nil if signed_data.nil?
      output_path = "#{@working_dir}/visible_signed_#{Time.now.to_i}.pdf"
      File.open(output_path, 'wb+', encoding: 'ascii-8bit') do |f|
        f.write(Base64.decode64(signed_data))
      end
      output_path
    end
  end
end
