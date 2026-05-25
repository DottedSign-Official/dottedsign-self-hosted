class FileTaskCreator < ServiceCaller
  attr_reader :task

  def initialize(task_info, client_info, setting_info = {})
    @task_info = task_info
    @client_info = client_info
    @setting_info = setting_info
  end

  def call
    ActiveRecord::Base.transaction do
      create_task
      generate_original_file
      make_thumbnail
      generate_full_file
      generate_original_thumbnail
      export_xfdf_from_full_file
    end
  end

  private

  def create_task
    info = SignTask.create_from_request(@task_info, @client_info, @setting_info, skip_original_upload_link: true)
    @task = SignTask.includes(:sign_stages).find(info[:task_id])
  end

  def generate_original_file
    attach_success = @task.upload_service_file('original', io: StringIO.new(Base64.decode64(@task_info[:file])),
                                               content_type: 'application/pdf',
                                               filename: 'file.pdf',
                                               skip_callback: true,
                                               force_upload: true)
    raise ServiceError.new(:file_not_ready) unless attach_success
  end

  def make_thumbnail
    maker = ThumbnailMaker.call(@task.original_file.id)
    raise maker.error if maker.failed?

    @task.original_file.force_upload_thumbnail(io: File.open(maker.result),
                                               content_type: 'image/jpeg',
                                               filename: 'file.jpg')
  ensure
    FileUtils.rm_rf(maker.working_dir) if maker&.working_dir.present?
  end

  def generate_full_file
    generator = KmpdfTool::PdfFormGenerator.call('SignTask', @task.id)
    raise generator.error if generator.failed?

    attach_success = @task.upload_service_file('full', io: File.open(generator.result),
                                               content_type: 'application/pdf',
                                               filename: 'file.pdf',
                                               skip_callback: true,
                                               force_upload: true)
    raise ServiceError.new(:file_not_ready) unless attach_success
  ensure
    FileUtils.rm_rf(generator.working_dir) if generator&.working_dir.present?
  end

  def generate_original_thumbnail
    ThumbnailMakerWorker.perform_async(@task.original_file.id)
  end

  def export_xfdf_from_full_file
    exporter = KmpdfTool::XfdfExporter.call('SignTask', @task.id, @task.sign_stages.pluck(:id))
    raise exporter.error if exporter.failed?
  ensure
    FileUtils.rm_rf(exporter.working_dir) if exporter.working_dir.present?
  end

end
