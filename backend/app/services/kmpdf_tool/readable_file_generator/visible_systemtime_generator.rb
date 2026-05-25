class KmpdfTool::ReadableFileGenerator
  class VisibleSystemtimeGenerator < ServiceCaller
    include CommandExecute

    attr_reader :task, :working_dir

    IMPORT_CMD_TEMPLATE = "#{Settings.pdf_tool_path} xfdf -c %{cache_dir} -fp #{Settings.pdf_font.path} -fn #{Settings.pdf_font.name} import form_to_annot %{imported_file} %{xfdf_file}".freeze

    def initialize(task, working_dir: nil)
      @task = task
      @working_dir = working_dir.presence || Settings.working_dir_for(task, create_dir: true)
    end

    def call
      setup_stages
      download_pre_signed_pdf
      xfdf_file = generate_xfdf_with_systemtimes
      import_xfdf(xfdf_file)
      @result = @pre_signed_file
    end

    private

    def setup_stages
      stages = task.stages.done.joins(:stage_file)
      @pre_done_stage = stages.max_by { |stage| stage.stage_file.uploaded_at.to_i }
    end

    def download_pre_signed_pdf
      service_file = @pre_done_stage.nil? ? task.original_file : @pre_done_stage.stage_file
      raise ServiceError.new(:file_not_exist) unless service_file.present? && service_file.uploaded?

      @pre_signed_file = "#{working_dir}/file_#{service_file.id}_#{Random.hex(4)}.pdf"
      service_file.download_to_local(@pre_signed_file)
      raise ServiceError.new(:file_download_error) unless File.exist?(@pre_signed_file)
    end

    def generate_xfdf_with_systemtimes
      empty_xfdf_doc = generate_empty_xfdf
      systemtimes = task.field_settings.where(field_type: 'systemtime')

      systemtimes.each do |systemtime|
        xfdf_xml = Nokogiri::XML(systemtime.stage.xfdf_content)
        field_xml = xfdf_xml.at_xpath("//*[@fieldname=\"#{systemtime.field_object_id}\"]")
        empty_xfdf_doc.at_xpath('//xmlns:widgets').add_child(field_xml)
      end

      xfdf_file_path = "#{working_dir}/systemtime.xfdf"
      File.open(xfdf_file_path, 'w+') { |file| file.write(empty_xfdf_doc.to_xml) }
      xfdf_file_path
    end

    def generate_empty_xfdf
      random_id = SecureRandom.uuid.upcase.gsub('-', '')
      Nokogiri::XML::Builder.new(encoding: 'UTF-8') do |xml|
        xml.xfdf('xmlns' => 'http://ns.adobe.com/xfdf/', 'xml:space' => 'preserve') {
          xml.widgets
          xml.f(href: '')
          xml.ids(modified: random_id, original: random_id)
        }
      end.doc
    end

    def import_xfdf(xfdf_file)
      import_cmd = IMPORT_CMD_TEMPLATE % { cache_dir: working_dir, imported_file: @pre_signed_file, xfdf_file: xfdf_file }
      import_res = execute_system_cmd(import_cmd)
      raise ServiceError.new(:command_execute_failed, error_msg: "run '#{import_cmd}' failed: #{import_res}") if command_failed?(import_res)
    end
  end
end
