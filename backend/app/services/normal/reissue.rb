module Normal
  class Reissue < ServiceCaller
    def initialize(task_id, stage_id, member, client_info)
      @task_id = task_id
      @stage_id = stage_id
      @member = member
      @client_info = client_info
    end

    def call
      setup_task
      setup_stage
      check_accessibility
      ActiveRecord::Base.transaction do
        begin
          perform_reissue
          record_event
        rescue StandardError => e
          raise ServiceError.new(:reissue_failed, error_msg: e.message)
        end
      end
      
      notify
    end

    private
    
    def setup_task
      @task = SignTask.find_by(id: @task_id)
      raise ServiceError.new(:task_not_found) if @task.nil?
    end

    def setup_stage
      @stage = @task.sign_stages.find_by(id: @stage_id)
      raise ServiceError.new(:stage_not_found) if @stage.nil?
    end

    def check_accessibility
      task_accessibility = @task.accessibility_of(@member, 'reissue', check_stage: @stage)
      raise ServiceError.new(task_accessibility) unless task_accessibility == :accessible
    end

    def perform_reissue
      @stage.processing!
      rollback_xfdf_document
      @stage.service_files.destroy_all
    end

    def rollback_xfdf_document
      exporter = KmpdfTool::XfdfExporter.call('SignTask', @task_id, @stage_id)
      raise exporter.error if exporter.failed?
      xfdf_document = @stage.xfdf_document
      xfdf_document.content = exporter.result[@stage_id]
      xfdf_document.save!
    end

    def record_event
      @task.add_sign_event(:reissue, @member.id, stage_info: @stage.basic_info, client_info: @client_info)
    end

    def notify
      return unless @stage.processing?
      Notification::ProcessingMailWorker.perform_async(@stage.id)
    end
  end
end