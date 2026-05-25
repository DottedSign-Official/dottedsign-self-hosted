class Api::V1::SignTasks::InfoController < Api::ApplicationController
  # authentication for quick sign (in CodeAuthenticationHelper)
  prepend_before_action :allow_code_authentication_strategy, only: [:read, :read_from_preview_share_link, :download]

  skip_before_action :setup_current_member, only: [:read_from_preview_share_link]
  before_action :security_checked, except: [:read, :read_from_preview_share_link]
  before_action :check_code_params_match!, only: [:read, :download]
  before_action :check_stage_done!, only: [:read]
  before_action :setup_task, except: [:summary]
  before_action :check_download_accessibility, only: [:download]
  before_action :check_available, except: [:summary]
  before_action :check_acceptance!, only: [:read, :download]
  before_action :check_expired!, only: [:read, :read_from_preview_share_link]
  before_action :preview_share_link_security_checked, only: [:read_from_preview_share_link]

  def read
    read_service = @envelope.present? ? Envelopes::Read.call(@envelope.id, current_member, read_params, client_params)
                                      : Normal::Read.call(@task.id, current_member, read_params, client_params)
    if read_service.success?
      entity = entity_class_for_source(read_service.source)
      serialize_response(entity, read_service.source, service: read_service, with_image_info: true, with_xfdf: true, with_task_infos: true)
    elsif read_service.error.error_obj.present?
      error_response(read_service.error.key, read_service.error.message, read_service.error.error_obj)
    else
      error_response(read_service.error.key)
    end
  end

  def read_from_preview_share_link
    entity = entity_class_for_source(@source)
    serialize_response(entity, @source, with_image_info: true, with_download_info: true, with_xfdf: true, with_task_infos: true)
  end

  def summary
    task_ids = SignTask.related_ids(current_member)
    category_ids = SignTask.category_ids(task_ids, current_member.id)
    summary = group_classified_task_ids_by_envelope(category_ids).map { |category, task_ids| [category, task_ids[:all].length] }.to_h
    success_response(summary)
  end

  def download
    download_file = @source.completed? ? @source.completed_file : @source.original_file
    download_info = download_file.download
    response.header["Content-Length"] = download_info[:size]
    add_sign_event(@source, download_file.label)
    send_data download_info[:content], filename: download_info[:file_name], type: download_info[:content_type], disposition: 'attachment'
  rescue ServiceError => error
    error_response(error.key)
  end

  private

  def check_download_accessibility
    @envelope.present? ? check_envelope_accessibility('download_task') : check_task_accessibility('download_task')
  end

  def read_params
    params.permit(verify_info: verify_info_permit_attrs)
  end

  def preview_share_link_security_checked
    if params[:sign_task_id].present?
      token = Doorkeeper::AccessToken.find_by_token(access_token)
      return error_response(:invalid_member) if token.blank?
      current_member = Member.find_by_id(token.resource_owner_id)
      return error_response(:invalid_member) if current_member.blank?
      return error_response(:need_super_admin) unless current_member.super_admin?
    end
  end

  def entity_class_for_source(source)
    source.class.name.underscore.to_sym
  end

  def add_sign_event(source, label)
    action = "download_#{label}_file"
    source.add_sign_event(action, current_member.id, client_info: client_params)
    source.sign_tasks.each do |task|
      task.add_sign_event(action, current_member.id, client_info: client_params)
    end if source.is_a?(Envelope)
  end

end
