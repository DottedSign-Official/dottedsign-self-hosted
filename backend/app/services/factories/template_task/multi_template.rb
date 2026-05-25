class Factories::TemplateTask::MultiTemplate < Factories::TemplateTask::CreateAndInvite
  attr_reader :task

  def initialize(member, template_codes, template_ids, task_info, setting_info: {}, client_info: {}, check_access: false, role_mapping: false, pdf_base64: "")
    @member = member
    @template_codes = template_codes
    @template_ids = template_ids
    @task_info = task_info
    @setting_info = setting_info
    @client_info = client_info
    @role_mapping = role_mapping
    @check_access = check_access
    @working_dirs = []
    @sign_type = :create_and_invite
    @pdf_base64 = pdf_base64
    if @pdf_base64.present?
      @working_dir = Settings.create_cache_working_dir
      @working_dirs << @working_dir
      @change_file_path = "#{@working_dir}/change.pdf"
    end
  end

  def call
    ActiveRecord::Base.transaction do
      check_member
      setup_template
      if @pdf_base64.present?
        base64_convert_pdf(@change_file_path, @pdf_base64)
        check_enough_page
        @file_path = @change_file_path
      end
      create_task
      create_task_stages
      create_task_setting
      record_create_event
      change_pdf(@file_path)
      @result = @task.id
    end
  ensure
    @working_dirs.each { |working_dir| FileUtils.rm_rf(working_dir) }
  end

  private

  def setup_template
    templates = @template_codes.map do |template_code|
      Template.find_by(code: template_code)
    end.compact if @template_codes.present?

    templates = @template_ids.map do |template_id|
      Template.find_by(id: template_id)
    end.compact if @template_ids.present?

    raise ServiceError.new(:template_not_found) if templates.length != @template_codes.length

    templates.each { |template| check_template_access(template) } if @check_access
    check_stage_infos(@task_info[:stages], templates.flat_map(&:dummy_stages))

    merger = TemplateMerger.call(@member.id, templates, @task_info)
    raise ServiceError.new(:template_merge_failed, error_message: merger.error.key) if merger.failed?

    @template = merger.result
    @file_path = merger.file_path
  ensure
    @working_dirs << merger.working_dir if merger&.working_dir.present?
  end

  def check_enough_page
    raise ServiceError.new(:not_enough_pages) if read_pdf_page(@file_path) > read_pdf_page(@change_file_path)
  end

end
