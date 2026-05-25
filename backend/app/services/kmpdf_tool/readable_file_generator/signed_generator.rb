class KmpdfTool::ReadableFileGenerator
  class SignedGenerator < ServiceCaller
    include ReadableFileOperator

    attr_reader :working_dir

    def initialize(task, stage_id = nil)
      @task = task
      @stage_id = stage_id
    end

    def call
      setup_stages
      download_pre_signed_pdf
      import_xfdf(@stage, @pre_signed_file, @working_dir, obtain_except_field_object_ids) if @stage.present?
      @result = @pre_signed_file
    end

    private

    def setup_stages
      stages = @task.stages.with_signers.done.joins(:stage_file)
      @pre_done_stage = stages.sort_by { |stage| -stage.stage_file.uploaded_at.to_i }.first

      return if @stage_id.nil?
      @stage = @task.stages.find_by_id(@stage_id)
      raise ServiceError.new(:stage_not_found) if @stage.nil?
    end

    def download_pre_signed_pdf
      @working_dir = Settings.working_dir_for(@task, create_dir: true)
      service_file = @pre_done_stage.nil? ? @task.original_file : @pre_done_stage.stage_file
      raise ServiceError.new(:file_not_exist) unless service_file.present? && service_file.uploaded?

      @pre_signed_file = "#{@working_dir}/file_#{service_file.id}_#{Random.hex(4)}.pdf"
      service_file.download_to_local(@pre_signed_file)
      raise ServiceError.new(:file_download_error) unless File.exist?(@pre_signed_file)
    end

    def obtain_except_field_object_ids
      @stage.field_settings.where("options->>'visible_ca' = ?", "true").pluck(:field_object_id)
    end

  end
end
