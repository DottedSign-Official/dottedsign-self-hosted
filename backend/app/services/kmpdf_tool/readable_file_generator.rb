module KmpdfTool
  class ReadableFileGenerator < ServiceCaller
    attr_reader :working_dir, :task

    def initialize(task_id, stage_id = nil)
      @task_id = task_id
      @stage_id = stage_id
    end

    def call
      setup_task
      generate_file
    end

    private

    def setup_task
      @task = SignTask.find_by_id(@task_id)
      raise ServiceError.new(:task_not_found) if @task.nil?
    end

    def generate_file
      if (@task.digit_cert_on_stage? || @task.visible_ca_on_stage?) && @task.file_processable?
        generator = SignedGenerator.call(@task, @stage_id)
      else
        generator = AllGenerator.call(@task, @stage_id)
      end
      raise generator.error if generator.failed?
      @working_dir = generator.working_dir
      @result = generator.result
    end
  end
end
