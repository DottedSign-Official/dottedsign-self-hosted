class Api::V1::SignTasksController < Api::ApplicationController
  before_action :security_checked
  before_action -> { check_emails_if_present(params[:stages]&.map { |s| s[:email] }) }, only: [:create, :update, :create_with_file, :create_from_template, :create_from_multi_template]
  before_action :setup_task, only: [:show, :update, :destroy, :start, :preview_share_link, :save_as_template, :duplicate]
  before_action :process_source_params, only: [:create, :update, :create_with_file]
  before_action :check_task_params, only: [:create, :update, :create_with_file]
  before_action :check_task_ownership, only: [:update, :destroy, :start, :preview_share_link, :duplicate]
  before_action :check_task_accessibility, only: [:show, :preview_share_link]
  before_action -> { check_task_accessibility('save_as_template') }, only: [:save_as_template]
  before_action -> { check_task_accessibility('delete_task') }, only: [:destroy]
  before_action :check_task_available, only: [:show, :update, :destroy, :start, :preview_share_link, :duplicate]
  before_action :check_task_expired!, only: [:show, :update, :start, :preview_share_link]
  before_action :check_task_category, only: [:index, :filter]
  before_action :check_cert_occassion, only: [:create, :sign_and_send, :create_with_file, :create_from_template, :create_from_multi_template]
  before_action :check_field_setting, only: [:create, :sign_and_send, :create_with_file]
  before_action :check_field_setting_group_params, only: [:create, :create_with_file]
  before_action :check_self_task_signature_exist, only: [:sign_and_send]
  def index
    task_infos = task_infos_of_category(params[:category], pagination_params)
    success_response(task_infos)
  end

  def show
    success_response(@task.display(current_member.id))
  end

  def update
    return error_response(:task_is_not_draft) unless @task.draft?
    task_info = @task.update_from_request(task_params, client_params, setting_params)
    task_info[:tag_info] = add_tag(@task) if params.key?(:tags)
    success_response(task_info)
  end

  def destroy
    return error_response(:task_not_deletable) unless @task.deletable?
    @task.do_deleted
    Notification::TaskDeletedRemindMail.perform_async(@task.class.name, @task.id)
    success_response(:ok)
  end

  def create
    task_info = SignTask.create_from_request(task_params, client_params, setting_params)
    task_info[:tag_info] = add_tag(SignTask.find_by_id(task_info[:task_id])) if params[:tags].present?
    success_response(task_info)
  end

  def sign_and_send
    task_info = SignTask.create_from_request(self_task_params, client_params)
    success_response(task_info)
  end

  def start
    return error_response(:task_is_not_draft) unless @task.draft?
    @task.start(client_params)
    success_response(category_for_owner_after_start: @task.category_for_owner_after_start)
  end

  def filter
    return error_response(:filter_not_allow) if SignTask::ALLOW_FILTERS.exclude?(params[:filter])
    task_infos = task_infos_of_filter(params[:category], params[:filter], pagination_params)
    success_response(task_infos)
  end

  def preview_share_link
    success_response(share_link: @task.preview_share_link(params[:will_expired]))
  end

  def duplicate
    duplicator = Factories::SignTask::DuplicateToDraft.call(@task, current_member, client_params)
    return error_response(duplicator.error.key, duplicator.error.message) if duplicator.failed?
    success_response(task_id: duplicator.result.id)
  end

  def create_with_file
    creator = FileTaskCreator.call(task_params, client_params, setting_params)
    return error_response(creator.error.key, creator.error.message) if creator.failed?

    task = creator.task
    task.start(client_params)
    return error_response(:file_not_ready) if task.draft?

    task_info = task.display(task.owner_id, with_sign_url: params[:with_sign_url])
    success_response(task_info)
  end

  def create_from_template
    creator = Factories::TemplateTask::CreateAndInvite.call(current_member, params[:template_id], template_create_task_info, template_code: params[:template_code], setting_info: setting_params, client_info: client_params, check_access: true, role_mapping: true, pdf_base64: params[:file])
    return error_response(creator.error.key, creator.error.message) if creator.failed?

    task = creator.task
    task.start(client_params)
    return error_response(:file_not_ready) if task.draft?

    task_info = task.display(task.owner_id, with_sign_url: params[:with_sign_url])
    success_response(task_info)
  end

  def create_from_multi_template
    creator = Factories::TemplateTask::MultiTemplate.call(current_member, params[:template_codes], params[:template_ids], template_create_task_info, setting_info: setting_params, client_info: client_params, check_access: true, role_mapping: true, pdf_base64: params[:file])
    return error_response(creator.error.key, creator.error.message) if creator.failed?

    task = creator.task
    task.start(client_params)
    return error_response(:file_not_ready) if task.draft?
    task.reload
    task_info = task.display(task.owner_id, with_sign_url: params[:with_sign_url])
    success_response(task_info)
  end

  def save_as_template
    creator = Factories::Template::FromTask.call(current_member.id, @task, params[:template_name])
    return error_response(creator.error.key, creator.error.message) if creator.failed?
    success_response(creator.result)
  end

  private

  def task_params
    process_task_params_for('create_and_invite')
    params.permit(:sign_type, :owner_id, :group_id, :file_name, :has_order, :file, stages: [:email, :name, :action, pdf_object_info: [], xfdf_info: xfdf_permit_attrs, field_setting_groups: field_setting_group_permit_attrs, custom_message_setting: custom_message_setting_attrs, attachment_setting: attachment_permit_attrs, stage_setting: stage_setting_attrs, verify: verify_attrs])
  end

  def self_task_params
    process_task_params_for('sign_and_send')
    params[:status] = SignTask.statuses[:draft]
    params[:stages] = [{ actor_id: current_member.id, actor_info: { email: current_member.email, role: 'Me' }, pdf_object_info: params[:pdf_object_info], xfdf_info: params[:xfdf_info], field_setting_groups: params[:field_setting_groups], sign_info: params[:sign_info] }]
    params[:start_from] = client_params.merge(time_zone: current_member.preference_info[:time_zone] || TimezoneMapping[:hour_zone].default)

    # call check_field_setting_group_params manually after params[:stages] is set
    check_field_setting_group_params
    params.permit(:sign_type, :owner_id, :group_id, :file_name, :has_order, :status, stages: [:actor_id, pdf_object_info: [], actor_info: [:email, :role], xfdf_info: xfdf_permit_attrs, field_setting_groups: field_setting_group_permit_attrs, sign_info: sign_permit_attrs, attachment_setting: attachment_permit_attrs], start_from: [:client, :ip_address, :user_agent, :time_zone])
  end

  def process_task_params_for(sign_type)
    process_source_params_for(sign_type)
    params[:stages].each do |stage_info|
      stage_info[:verify] ||= [{ verify_type: 'signer_detect' }]
    end if params[:need_otp_verify]
  end

  def check_self_task_signature_exist
    self_task_params[:stages].each do |stage|
      check_signature_exist(stage[:sign_info]) if stage[:sign_info].present?
    end
  end

  def add_tag(task)
    current_member.tag(task, with: params[:tags], on: :tags)
    task.tag_info_for(current_member.id)
  end
end
