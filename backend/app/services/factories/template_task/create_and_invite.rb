class Factories::TemplateTask::CreateAndInvite < ServiceCaller
  attr_reader :task

  include PdfReader

  def initialize(member, template_id, task_info, template_code: nil, setting_info: {}, client_info: {}, check_access: false, role_mapping: false, pdf_base64: "")
    @member = member
    @template_id = template_id
    @template_code = template_code
    @task_info = task_info
    @setting_info = setting_info
    @client_info = client_info
    @role_mapping = role_mapping
    @check_access = check_access
    @sign_type = :create_and_invite
    @pdf_base64 = pdf_base64
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

  def check_member
    raise ServiceError.new(:member_not_found) if @member.nil?
  end

  def setup_template
    @template = if @template_code.present?
                  Template.with_display_content.find_by(code: @template_code, status: Template.statuses[:active])
                else
                  Template.with_display_content.find_by_id(@template_id)
                end
    raise ServiceError.new(:template_not_found) if @template.nil?
    raise ServiceError.new(:template_deleted) if @template.deleted?

    check_stage_infos(@task_info[:stages], @template.dummy_stages)

    check_template_access(@template) if @check_access
  end

  def check_template_access(template)
    raise ServiceError.new(:template_deleted) if template.deleted?
    raise ServiceError.new(:template_not_accessible) unless template.accessibility_of(@member) == :accessible
  end

  def check_stage_infos(stage_infos, stages)
    raise ServiceError.new(:no_stage_infos) if stage_infos.blank?

    required_roles = stages.map { |stage| stage.actor_info['role'] }.uniq
    stage_roles = stage_infos.pluck(:role)
    raise ServiceError.new(:missing_stage_infos) if (stage_roles - required_roles | required_roles - stage_roles).present?
    raise ServiceError.new(:duplicate_role) if @template.present? && !@template.has_order && stage_roles.uniq.length != stage_roles.length

    stage_infos.each do |info|
      raise ServiceError.new(:stage_no_name) if info[:name].blank?
      raise ServiceError.new(:stage_no_phone) if info[:need_otp_verify] && info[:phone].blank?
    end
  end

  def create_task
    @task = SignTask.create!(
      file_name: @task_info[:file_name].presence || @template.file_name,
      owner_id: @member.id,
      has_order: @template.has_order,
      sign_type: SignTask.sign_types[@sign_type],
      bulk_mission_id: @task_info[:mission_id],
      public_form_id: @task_info[:form_id]
    )
  end

  def create_task_stages
    stages = @task_info[:stages]
    if @role_mapping
      roles_arr = @template.dummy_stages.map { |stage| stage.actor_info["role"] }
      stages = stages.sort_by do |stage|
        index = roles_arr.index(stage[:role])
        raise ServiceError.new(:role_not_found) if index.nil?
        index
      end
    end

    @template.dummy_stages.each_with_index do |dummy_stage, index|
      dummy_stage_info = dummy_stage.as_json(only: [:sequence, :action, :pdf_object_info, :attachment_setting, :custom_message_setting]).symbolize_keys
      stage_info = stages[index]
      stage = @task.sign_stages.create!(dummy_stage_info.deep_merge(stage_info.slice(*SignStage.column_names.map(&:to_sym))))

      create_stage_xfdf(stage, dummy_stage.xfdf_document)
      create_stage_field_setting_groups(stage, dummy_stage.field_setting_groups)
      create_stage_field_settings(stage, dummy_stage.field_settings)
      create_stage_setting(stage, dummy_stage.stage_setting, stage_info)
      create_verify_methods(stage, dummy_stage.verify_methods, stage_info)
    end
  end

  def create_stage_xfdf(stage, dummy_xfdf)
    stage.create_xfdf_document(source: @task, content: dummy_xfdf&.content)
  end

  def create_stage_field_settings(stage, dummy_field_settings)
    dummy_field_settings.each do |dummy_setting|
      setting = dummy_setting.deep_dup
      setting.source = @task
      setting.stage = stage
      setting.field_value = nil
      setting.save
    end
  end

  def create_stage_field_setting_groups(stage, dummy_field_setting_groups)
    return if dummy_field_setting_groups.blank?
    dummy_field_setting_groups.each do |dummy_field_group|
      field_group = stage.field_setting_groups.build(source: @task)
      field_group.assign_attributes(dummy_field_group.as_json(only: [:field_group_type, :field_group_object_id, :options]))
      field_group.save
    end
  end

  def create_stage_setting(stage, setting_info, stage_info)
    return if setting_info.blank?
    setting_info = setting_info.display_info.symbolize_keys.merge!(stage_info[:stage_setting] || {})
    setting_info[:decline_enable] = false if stage_info[:email] == @member.email
    viewable_attachment_id_map = stage.reset_attachment_ids!
    StageSetting.setup_from_request(stage.class.base_class.name, stage.id, setting_info.with_indifferent_access, viewable_attachment_id_map: viewable_attachment_id_map)
  end

  def create_verify_methods(stage, dummy_verify_methods, stage_info)
    verify_infos = stage_info[:verify] || dummy_verify_methods.as_json(only: [:verify_type, :verify_source, :sequence, :occassion]).map(&:symbolize_keys)
    return if verify_infos.blank?
    verify_infos.each do |verify_info|
      verify_info[:verify_source] = stage.actor_info['email'] if verify_info[:verify_type] == 'email'
    end if stage.action_form_sign?
    VerifyMethod.setup_from_request(stage.class.base_class.name, stage.id, verify_infos)
  end

  def create_task_setting
    source_setting = @template.setting_info(member_id: @member.id)
    setting_info = source_setting.merge(@setting_info).symbolize_keys
    return if setting_info.blank?
    TaskSetting.setup_from_request(@member.id, @task.id, setting_info.slice(*TemplateSetting.column_names.map(&:to_sym)))
  end

  def add_template_tags_to_task
    template_tags = @template.assigned_tags_by(@member)
    @member.tag(@task, with: template_tags, on: :tags)
  end

  def record_create_event
    @task.add_sign_event(:created, @member.id, client_info: @client_info)
  end

  def duplicate_files
    @template.original_file.copy_to(@task, 'original', skip_callback: true)
    @template.full_file.copy_to(@task, 'full', skip_callback: true)
  end

  def change_pdf(change_file_path)
    generate_original_file(change_file_path)
    make_thumbnail
    generate_full_file
    export_xfdf_from_full_file
  end

  def check_enough_page
    raise ServiceError.new(:not_enough_pages) if download_and_read_page(@original_file_path, @template.original_file) > read_pdf_page(@change_file_path)
  end

  def base64_convert_pdf(file_path, file_base64)
    File.open(file_path, 'wb+') do |file|
      file.write(Base64.decode64(file_base64))
    end
  end

  def generate_original_file(file_path)
    attach_success = @task.upload_service_file('original', io: File.open(file_path),
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
    @working_dirs << maker.working_dir if maker&.working_dir.present?
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
    @working_dirs << generator.working_dir if generator&.working_dir.present?
  end

  def export_xfdf_from_full_file
    exporter = KmpdfTool::XfdfExporter.call('SignTask', @task.id)
    raise exporter.error if exporter.failed?
  ensure
    @working_dirs << exporter.working_dir if exporter&.working_dir.present?
  end
end
