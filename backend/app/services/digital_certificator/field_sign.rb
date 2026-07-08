require "pdf-reader"

module DigitalCertificator
  class FieldSign < ServiceCaller
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
      @result = sign_visible_field
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

    def sign_visible_field
      field_xml = @xfdf_xml.at_xpath("//*[@fieldname=\"#{@field_object_id}\"]")
      field_info = get_basic_info_from_field_xml(field_xml)
      image_path = save_image_hex(field_xml.at('image').content)

      signer = visible_ca_sign_class.call(
        @file_path, image_path, field_info,
        custom_cert: @custom_cert, system_ca: @system_ca,
        cert_type: @cert_type, cert_info: @cert_info,
        log_info: @log_info, working_dir: @working_dir
      )
      raise signer.error if signer.failed?
      signer.result
    end

    def visible_ca_sign_class
      provider = Settings.digital_signature.provider
      klass = "DigitalCertificator::#{provider.camelize}FieldSign".safe_constantize
      raise ServiceError.new(:invalid_params, error_msg: "unsupported provider for visible CA: #{provider}") if klass.nil?
      klass
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
        { width: coords[3] - coords[1], height: coords[2] - coords[0] }
      else
        { width: coords[2] - coords[0], height: coords[3] - coords[1] }
      end
    end
  end
end
