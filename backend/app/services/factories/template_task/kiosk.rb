class Factories::TemplateTask::Kiosk < Factories::TemplateTask::CreateAndInvite
  attr_reader :task

  def initialize(member, template_id, task_info, setting_info: {}, client_info: {}, pdf_base64: "")
    @member = member
    @template_id = template_id
    @task_info = task_info
    @setting_info = setting_info
    @client_info = client_info
    @pdf_base64 = pdf_base64
    @sign_type = :kiosk
    @working_dirs = []
    @working_dir = Settings.create_cache_working_dir
    if @pdf_base64.present?
      @working_dirs << @working_dir
      @original_file_path = "#{@working_dir}/original.pdf"
      @change_file_path = "#{@working_dir}/change.pdf"
    end
  end

  def call
    ActiveRecord::Base.transaction do
      check_member
      setup_template
      create_task
      create_task_stages
      create_task_setting
      record_create_event
      if @pdf_base64.present?
        base64_convert_pdf(@change_file_path, @pdf_base64)
        check_enough_page
        change_pdf(@change_file_path)
      else
        duplicate_files
      end
      @result = @task.id
    end
  ensure
    @working_dirs.each { |working_dir| FileUtils.rm_rf(working_dir) } if @working_dirs.present?
  end

  private

  def setup_template
    @template = Template.find_by_id(@template_id)
    raise ServiceError.new(:template_not_found) if @template.nil?
    raise ServiceError.new(:template_deleted) if @template.deleted?
    raise ServiceError.new(:template_need_order) unless @template.has_order
    raise ServiceError.new(:template_not_accessible) if @template.accessibility_of(@member) != :accessible
  end

  def create_task_stages
    @template.dummy_stages.includes(:xfdf_document, :field_settings, :field_setting_groups).each_with_index do |dummy_stage, index|
      stage_info = @task_info[:stages][index]
      stage = dummy_stage.deep_dup
      stage.actor_info['role'] = stage_info[:role] if stage_info[:role].present?
      stage.source = @task
      stage.save!
      create_stage_xfdf(stage, dummy_stage.xfdf_document)
      create_stage_field_setting_groups(stage, dummy_stage.field_setting_groups)
      create_stage_field_settings(stage, disable_visible_ca_options(dummy_stage.field_settings))
      create_stage_setting(stage, stage_info[:others])
    end
  end

  def create_stage_setting(stage, setting_info)
    return if setting_info.blank?
    StageSetting.setup_from_request(stage.class.base_class.name, stage.id, setting_info)
  end

  def disable_visible_ca_options(field_settings)
    field_settings.each do |field_setting|
      field_setting.options["visible_ca"] = false if field_setting.options["visible_ca"].present?
    end
  end

end
