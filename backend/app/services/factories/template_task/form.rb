class Factories::TemplateTask::Form < Factories::TemplateTask::CreateAndInvite

  def initialize(member, template_id, task_info, client_info)
    super(member, template_id, task_info)
    @client_info = client_info
    @sign_type = :form
    @attachment_id_map = {}
  end

  def call
    check_member
    setup_source
    create_task
    create_task_stages
    create_task_setting
    add_template_tags_to_task
    format_task_name
    record_create_event
    duplicate_files
    @result = @task
  end

  private

  def setup_source
    setup_template
    raise ServiceError.new(:template_not_found) unless @template.stages_xfdf_exist?
    raise ServiceError.new(:template_need_order) if !@template.has_order
    raise ServiceError.new(:not_match_stages_length) if @template.dummy_stages.length != @task_info[:stages].length
    @signer_infos = PublicForm.find_by(id: @task_info[:form_id]).signer_infos
  end

  def create_verify_methods(stage, dummy_verify_methods, stage_info)
    return if stage.action_form_sign? && stage_info[:stage_setting][:requisite]['email'] != 'required'
    super(stage, dummy_verify_methods, stage_info)
  end

  def format_task_name
    @task.update(file_name: @task.form_display_name)
  end
end
