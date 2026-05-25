class KmpdfTool::ReadableFileGenerator
  class AllGenerator < ServiceCaller
    include ReadableFileOperator

    attr_reader :working_dir

    def initialize(task, stage_id = nil)
      @task = task
      @stage_id = stage_id
    end

    def call
      setup_stages
      download_origin_pdf
      import_stages_xfdf
      @result = @imported_file
    end

    private

    def setup_stages
      @stages = @task.stages.with_signers
      valid_stage_ids = @stages.pluck(:id) + [nil]
      raise ServiceError.new(:not_valid_stage, error_msg: "stage #{@stage_id} not belong to task #{@task.id}") if valid_stage_ids.exclude?(@stage_id)
    end

    def download_origin_pdf
      @working_dir = Settings.working_dir_for(@task, create_dir: true)
      service_file = @task.original_file
      raise ServiceError.new(:file_not_exist) unless service_file.present? && service_file.uploaded?

      @imported_file = "#{@working_dir}/file_#{service_file.id}_#{Random.hex(4)}.pdf"
      service_file.download_to_local(@imported_file)
      raise ServiceError.new(:file_download_error) unless File.exist?(@imported_file)
    end

    def import_stages_xfdf
      @stages.includes(:xfdf_document).each_with_index do |sign_stage, index|
        import_xfdf(sign_stage, @imported_file, @working_dir, [])
      end
    end

  end
end
