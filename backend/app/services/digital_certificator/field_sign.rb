require "pdf-reader"

module DigitalCertificator
  class FieldSign < ServiceCaller
    include DigitalCertLog

    attr_reader :working_dir

    def initialize(file_path, xfdf_document_id, field_object_id, custom_cert: false, system_ca: nil, cert_type: 'user_cert', cert_info: {}, log_info: {})
      @working_dir = File.dirname(file_path)
      @images_dir = "#{@working_dir}/images"
      @file_path = file_path
      @custom_cert = custom_cert
      @system_ca = system_ca
      @cert_type = cert_type
      @cert_info = cert_info
      @log_info = log_info
      @xfdf_document_id = xfdf_document_id
      @field_object_id = field_object_id
    end

    def call
      FileUtils.mkdir_p(@images_dir)
      get_xfdf_xml
      get_pdf_page_infos
      signed_signature_field
      @result = write_signed_data_to_file
    ensure
      FileUtils.rm_rf(@images_dir)
    end

    private

    def get_xfdf_xml
      xfdf = XfdfDocument.find_by_id(@xfdf_document_id)
      raise ServiceError.new(:xfdf_not_found) if xfdf.nil?
      @xfdf_xml = Nokogiri::XML(xfdf.content)
    end

    def get_pdf_page_infos
      reader = PDF::Reader.new(@file_path)
      @page_infos = {}
      reader.pages.length.times do |page_idx|
        page = reader.page(page_idx + 1)
        page_media_box = page.attributes[:MediaBox]
        page_media_box = reader.objects[page_media_box.id] if page_media_box.is_a?(PDF::Reader::Reference)
        @page_infos[page_idx] = {
          page: page_idx,
          width: page_media_box[2] - page_media_box[0],
          height: page_media_box[3] - page_media_box[1],
          rotate: page.rotate,
          height_width_change: page.rotate == 90 || page.rotate == 270
        }
      end
    end

    def signed_signature_field
      field_xml = @xfdf_xml.at_xpath("//*[@fieldname=\"#{@field_object_id}\"]")
      field_info = get_basic_info_from_field_xml(field_xml)
      image_hex = field_xml.at('image').content
      image_path = save_image_hex(image_hex)
      process = ImageProcess.call(image_path, field_info[:coords], field_info[:field_size], field_info[:page_info])
      raise process.error if process.failed?
      @signed_data = apply_digital_certification(process.result, nil)
    end

    def apply_digital_certification(image_info, b64pdf)
      if @cert_type == 'user_cert'
        resp = DigitalCertificate::Hsm.apply_user_visible_cert(@file_path, image_info.delete(:path), image_info, @cert_info, b64pdf)
      else
        ap_info = if @system_ca.present?
                    @system_ca.cert_info.merge!(long_id: @cert_info[:long_id])
                  else
                    @custom_cert ? @cert_info : DigitalCertificate::Gra.get_system_ap_info(task_id: @log_info[:task_id])
                  end
        resp = DigitalCertificate::Hsm.apply_ap_visible_cert(@file_path, image_info.delete(:path), image_info, ap_info, b64pdf)
      end
      raise ServiceError.new(:digit_sign_failed, error_message: resp.to_s) unless resp['status'] == 200
      raise ServiceError.new(:digit_sign_failed, error_message: resp.to_s) unless resp['code'] == '0'
      record_digital_cert_apply_log(:successed)
      resp['msg']
    rescue => error
      record_digital_cert_apply_log(:failed, error_message: error.message)
      raise error
    end

    def write_signed_data_to_file
      return nil if @signed_data.nil?

      output_path = "#{@working_dir}/visible_signed_#{Time.now.to_i}.pdf"
      File.open(output_path, 'wb+', encoding: 'ascii-8bit') do |f|
        f.write(Base64.decode64(@signed_data))
      end
      output_path
    end

    def get_basic_info_from_field_xml(field_xml)
      page = field_xml.attribute('page').value
      info = {
        page_info: @page_infos[page.to_i],
        coords: field_xml.attribute('rect').content.split(',').map(&:to_f)
      }
      info[:field_size] = calc_field_size(info[:coords], info[:page_info][:height_width_change])
      info
    end

    def save_image_hex(image_hex)
      image_bin = image_hex.scan(/../).map { |x| x.hex }.pack('c*')
      image_path = "#{@images_dir}/signature_#{Time.now.to_i}.png"
      File.open(image_path, 'wb+') { |f| f.write(image_bin) }
      image_path
    end

    def calc_field_size(coords, height_width_change = false)
      if height_width_change
        {
          width: coords[3] - coords[1],
          height: coords[2] - coords[0]
        }
      else
        {
          width: coords[2] - coords[0],
          height: coords[3] - coords[1]
        }
      end
    end

  end
end
