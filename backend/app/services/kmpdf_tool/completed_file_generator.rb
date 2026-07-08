module KmpdfTool
  class CompletedFileGenerator < ServiceCaller
    DEFAULT_KMPDF_COMMANDS = ['annotate', 'system_time'].freeze

    def initialize(task, readable_path, pdf_commands: [])
      @task = task
      @readable_path = readable_path
      @pdf_commands = pdf_commands.blank? ? DEFAULT_KMPDF_COMMANDS : pdf_commands
    end

    def call
      @pdf_commands.each do |cmd|
        send(cmd) if respond_to?(cmd, true)
      end
      @result = @readable_path
    end

    private

    def annotate
      return if @task.digit_cert_on_stage? || @task.visible_ca_on_stage?
      generator = PdfAnnotateGenerator.call(@task.field_settings, @readable_path)
      @readable_path = generator.result if generator.success?
    end

    def system_time
      return unless (@task.digit_cert_on_stage? || @task.visible_ca_on_stage?) && @task.file_processable?
      generator = ReadableFileGenerator::VisibleSystemtimeGenerator.call(@task, working_dir: File.dirname(@readable_path))
      raise generator.error if generator.failed?
      @readable_path = generator.result
    end
  end
end
