module KmpdfTool
  class PdfFileMerge < ServiceCaller
    include CommandExecute

    MERGE_CMD = "#{Settings.pdf_tool_path} merge -o %{output_path} %{merge_files}".freeze

    def initialize(output_path, files=[])
      @output_path = output_path
      @files = files
    end

    def call
      check_files
      merge_file
    end

    private
    def check_files
      raise ServiceError.new(:empty_files) if @files.blank?
      raise ServiceError.new(:only_one_file) if @files.length == 1
    end

    def merge_file
      args = {
        output_path: @output_path,
        merge_files: @files.join(" ")
      }
      apply_cmd = MERGE_CMD % args
      apply_result = execute_system_cmd(apply_cmd)
      raise ServiceError.new(:command_execute_failed, error_msg: "run '#{apply_cmd}' failed: #{apply_result}") if command_failed?(apply_result)
    end
  end
end

