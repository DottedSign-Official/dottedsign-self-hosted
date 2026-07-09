class Api::Internal::SignTasksController < Api::Internal::ApplicationController
  skip_before_action :setup_current_member, only: [:download, :task_info, :tasks]
  before_action -> { check_emails_if_present(params[:stages]&.map { |s| s[:email] }) }, only: [:create_with_file, :create_from_template]
  before_action :check_cert_occassion, only: [:create_with_file, :create_from_template]

  def create_with_file
    creator = FileTaskCreator.call(task_params, client_params, task_setting_params)
    return error_response(creator.error.key, creator.error.message) if creator.failed?

    task = creator.task
    task.start(client_params)
    return error_response(:file_not_ready) if task.draft?

    task_info = task.display(task.owner_id, with_sign_url: true)
    success_response(task_info)
  end

  def create_from_template
    creator = Factories::TemplateTask::CreateAndInvite.call(current_member, params[:template_id], template_create_task_info, template_code: params[:template_code], setting_info: template_setting_params, client_info: client_params, check_access: true, role_mapping: true, pdf_base64: params[:file])
    return error_response(creator.error.key, creator.error.message) if creator.failed?

    task = creator.task
    task.start(client_params)
    return error_response(:file_not_ready) if task.draft?

    task_info = task.display(task.owner_id, with_sign_url: true)
    success_response(task_info)
  end

  def download
    sign_task = SignTask.find_by(id: download_params[:sign_task_id])
    return error_response(:task_not_found) unless sign_task.present?
    return error_response(:task_is_not_completed) unless sign_task.completed?
    file = sign_task.service_files.uploaded.find_by(label: download_params[:label])

    unless file.present?
      sign_task.audit_trails_pdf_content if download_params[:label] == 'audit_trail'
      return error_response(:file_not_ready)
    end

    if download_params[:download_type] == 'file'
      download_info = file.download
      response.header["Content-Length"] = download_info[:size]
      send_data download_info[:content], filename: download_info[:file_name], type: download_info[:content_type], disposition: 'attachment'
    else
      success_response(file.download_base64)
    end
  end

  def task_info
    task = SignTask.find_by(id: task_info_params[:sign_task_id])
    return error_response(:task_not_found) unless task.present?

    serialize_response(:task_info, task)
  end

  def tasks
    service = Developer::FilteredTaskList.call(task_list_filter_params)
    serialize_response(:developer_task_list, service.result)
  end

  private

  def download_params
    require_attrs = [:sign_task_id, :label, :download_type]
    params.require(require_attrs)
    params.permit(*require_attrs)
  end

  def task_info_params
    require_attrs = [:sign_task_id]
    params.require(require_attrs)
    params.permit(*require_attrs)
  end

  def task_params
    process_task_params_for('create_and_invite')
    params.permit(:sign_type, :owner_id, :file_name, :has_order, :file, stages: [:email, :name, pdf_object_info: [], xfdf_info: xfdf_permit_attrs, field_setting_groups: field_setting_group_permit_attrs, custom_message_setting: custom_message_setting_attrs, attachment_setting: attachment_permit_attrs, stage_setting: stage_setting_attrs, verify: verify_attrs])
  end

  def process_task_params_for(sign_type)
    params[:owner_id] = current_member.id
    params[:sign_type] = sign_type
    params[:has_order] = strict_boolean(params[:has_order]) if params[:has_order].present?
    params[:verify] = [{ verify_type: 'signer_detect' }] if params[:need_otp_verify]
  end

end
