module DigitalCertificator
  class PsigFieldSign < ServiceCaller
    include DigitalCertLog
    include CommandExecute

    def initialize(file_path, image_path, field_info, custom_cert: false, system_ca: nil, cert_type: 'ap_cert', cert_info: {}, log_info: {}, working_dir: nil)
      @file_path = file_path
      @image_path = image_path
      @field_info = field_info
      @cert_info = cert_info
      @log_info = log_info
      @working_dir = working_dir || File.dirname(file_path)
    end

    def call
      page_info = @field_info[:page_info]
      output_path = "#{@working_dir}/visible_signed_#{Time.now.to_i}.pdf"
      sign_info = DigitalCertificate::Psig.default_sign_info.merge(
        visible_signature_page: page_info[:page] + 1,
        visible_signature_rect: build_rect_string(@field_info[:coords], page_info),
        visible_signature_image_file: @image_path
      )
      resp = DigitalCertificate::Psig.sign(@file_path, output_path, sign_info)
      raise ServiceError.new(:digit_sign_failed, error_msg: resp.to_s) if command_failed?(resp, failed_regex: /stderr/)
      record_digital_cert_apply_log(:successed)
      @result = output_path
    rescue => error
      record_digital_cert_apply_log(:failed, error_message: error.message)
      raise error
    end

    private

    # xfdf coords are in the page's rotated display space; convert to PDF unrotated space.
    # psig --visible-signature-rect uses x,y,width,height where y is distance from top of page.
    def build_rect_string(coords, page_info)
      x1, y1, x2, y2 = case page_info[:rotate]
                        when 90, -270
                          [coords[1], page_info[:width] - coords[2],
                           coords[3], page_info[:width] - coords[0]]
                        when 270, -90
                          [page_info[:height] - coords[3], coords[0],
                           page_info[:height] - coords[1], coords[2]]
                        when 180, -180
                          [page_info[:width] - coords[2], page_info[:height] - coords[3],
                           page_info[:width] - coords[0], page_info[:height] - coords[1]]
                        else
                          coords
                        end
      "#{x1},#{page_info[:height] - y2},#{x2 - x1},#{y2 - y1}"
    end
  end
end
