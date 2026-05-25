module KmpdfTool
  class PdfFlatten < ServiceCaller
    include CommandExecute

    attr_reader :working_dir

    FLATTEN_CMD = "#{Settings.pdf_tool_path} flatten -o %{output_file} %{input_file} %{flatten_type} page=%{page}".freeze
    # if page is -1, flatten all file; else only flatten specific page

    def initialize(input_file, flatten_type, page=-1)
      @input_file = input_file
      @flatten_type = flatten_type
      @page = page
      @working_dir = File.dirname(@input_file)
    end

    def call
      flatten_cmd = FLATTEN_CMD % sub_elements
      flatten_res = execute_system_cmd(flatten_cmd)
      raise ServiceError.new(:command_execute_failed, error_msg: "run '#{flatten_cmd}' failed: #{flatten_res}") if command_failed?(flatten_res)
      @result = sub_elements[:output_file]
    end

    private

    def sub_elements
      {
        input_file: @input_file,
        output_file: @input_file.sub(/.pdf$/, "_flatten.pdf"),
        flatten_type: @flatten_type,
        page: @page
      }
    end
  end
end
