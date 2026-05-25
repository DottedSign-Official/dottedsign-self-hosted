module KmpdfTool
  class WatermarkApply < ServiceCaller
    include CommandExecute

    attr_reader :working_dir, :sign_task

    APPLY_CMD = "#{Settings.pdf_tool_path} create -o %{output_file} %{input_file} watermark isfront=yes type=image imagepath=%{image_file} \
                scale=%{scale} opacity=%{opacity} rotation=%{rotation} vertalign=%{vertalign} horizalign=%{horizalign} isfullscreen=%{isfullscreen} \
                xoffset=%{xoffset} yoffset=%{yoffset} horizontalspacing=30 verticalspacing=30"

    def initialize(task_id, mark_type)
      @task_id = task_id
      @mark_type = mark_type
    end

    def call
      setup_object
      download_original_file
      apply_watermark
      @result = @output_file
    end

    private

    def setup_object
      @sign_task = SignTask.find(@task_id)
      @image_file = "public/watermarks/#{@mark_type}_small.png"
    end

    def download_original_file
      @working_dir = Settings.working_dir_for(@sign_task, create_dir: true)
      raise ServiceError.new(:file_not_exist) unless @sign_task.original_file.present?
      @input_file = @sign_task.original_file.download_to_local("#{@working_dir}/original.pdf")
      @output_file = @input_file.sub(/.pdf$/, '_watermark.pdf')
    end

    def apply_watermark
      elements = {
        input_file: @input_file,
        output_file: @output_file,
        image_file: @image_file,
        scale: 1,
        opacity: 1,
        rotation: 0,
        vertalign: 'center',
        horizalign: 'center',
        isfullscreen: 'no',
        xoffset: 0,
        yoffset: 0
      }

      apply_cmd = APPLY_CMD % elements
      apply_result = execute_system_cmd(apply_cmd)
      raise ServiceError.new(:command_execute_failed, error_msg: "run '#{apply_cmd}' failed: #{apply_result}") if command_failed?(apply_result)
    end

  end
end
