module KmpdfTool
  class XfdfExporter < ServiceCaller
    include CommandExecute

    EXPORT_CMD = "#{Settings.pdf_tool_path} xfdf export -c %{cache_dir} form %{exported_file} %{output_file} %{object_ids}".freeze

    attr_reader :working_dir, :source

    def initialize(source_type, source_id, stage_ids=nil)
      @source_type = source_type
      @source_id = source_id
      @stage_ids = stage_ids
    end

    def call
      setup_source
      setup_stages
      @result = download_full_pdf{extract_xfdf}
    end

    private

    def setup_source
      @source = @source_type.constantize.find(@source_id)
    end

    def setup_stages
      @stage_type = @source.stage_class
      @stages = @stage_ids.nil? ? @source.stages : @source.stages.where(id: @stage_ids)
      raise ServiceError.new(:no_valid_stages) if @stages.blank?
    end

    def download_full_pdf(&block)
      @working_dir = Settings.working_dir_for(@source, create_dir: true)
      raise ServiceError.new(:file_not_ready) unless @source.full_file.present?
      @source.full_file.file.open(tmpdir: @working_dir) do |file|
        @exported_file = file.path
        yield
      end
    end

    def extract_xfdf
      success_export = {}
      @stages.each do |stage|
        next if stage.pdf_object_info.nil?
        sub_elements = format_sub_elements(stage)
        export_cmd = EXPORT_CMD % sub_elements
        export_cmd.chop! if sub_elements[:object_ids].nil?
        puts "run #{export_cmd}"
        export_res = execute_system_cmd(export_cmd)
        next if command_failed?(export_res)
        xfdf_attrs = {
          source_id: @source_id,
          source_type: @source_type,
          stage_id: stage.id,
          stage_type: @stage_type
        }
        xfdf_doc = XfdfDocument.create_from_xfdf_file(xfdf_attrs, sub_elements[:output_file])
        success_export[stage.id] = xfdf_doc.content if xfdf_doc.present?
      end
      FileUtils.rm_rf(@working_dir)
      success_export
    end

    def format_sub_elements(stage)
      {
        exported_file: @exported_file,
        output_file: @exported_file.sub(/.pdf$/, "_stage_#{stage.id}.xfdf"),
        object_ids: stage.pdf_object_info&.join(' '),
        cache_dir: @working_dir
      }
    end
  end
end
