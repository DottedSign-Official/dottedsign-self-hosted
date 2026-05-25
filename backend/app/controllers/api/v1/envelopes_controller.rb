class Api::V1::EnvelopesController < Api::ApplicationController
  include Api::V1::Envelopes::AttributeHelper
  include Api::V1::Envelopes::CheckHelper
  include Api::V1::Envelopes::ProcessParamsHelper

  before_action :security_checked
  before_action :check_and_setup_envelope, only: [:update, :destroy, :start, :preview_share_link, :duplicate]
  before_action :check_envelope_params, only: [:create, :update]
  before_action :check_envelope_ownership, only: [:update, :destroy, :start, :preview_share_link, :duplicate]
  before_action :check_envelope_accessibility, only: [:preview_share_link]
  before_action :check_delete_envelope_accessibility, only: [:destroy]
  before_action :check_envelope_available, only: [:update, :destroy, :start, :preview_share_link, :duplicate]
  before_action :check_cert_occassion, only: [:create]
  before_action :check_envelope_expired!, only: [:show, :update, :start, :preview_share_link]
  before_action :check_envelope_field_setting, only: [:create]
  before_action :check_field_setting_group_params, only: [:create, :update]

  def create
    creator = Factories::Envelope::Creator.call(current_member, envelope_params, tasks_params, client_params, setting_params)
    return error_response(creator.error) if creator.failed?
    success_response(creator.result)
  end

  def update
    updater = Factories::Envelope::Updater.call(current_member, @envelope, envelope_params, tasks_params, client_params, setting_params)
    return error_response(updater.error) if updater.failed?
    success_response(updater.result)
  end

  def destroy
    @envelope.do_deleted
    Notification::TaskDeletedRemindMail.perform_async(@envelope.class.name, @envelope.id)
    success_response(:ok)
  end

  def start
    starter = Factories::Envelope::Starter.call(@envelope, client_params)
    return error_response(starter.error) if starter.failed?
    success_response(starter.result)
  end

  def preview_share_link
    success_response(share_link: @envelope.preview_share_link(params[:will_expired]))
  end

  def duplicate
    duplicator = Factories::Envelope::DuplicateToDraft.call(@envelope, current_member, client_params)
    return error_response(duplicator.error) if duplicator.failed?
    success_response(envelope_id: duplicator.result.id)
  end

  private

  def envelope_params
    process_envelope_params
    params.permit(:owner_id, :group_id, :sign_type, :has_order, :envelope_name, :has_order, tags: [], stages: envelope_stage_permit_attrs)
  end

  def tasks_params
    process_task_params
    params.permit(task_infos: [:owner_id, :group_id, :sign_type, :has_order, :task_id, :envelope_file_id, :file_name, file_info: file_info_permit_attrs, stages: task_stage_permit_attrs])[:task_infos]
  end

  def check_delete_envelope_accessibility
    check_envelope_accessibility('delete_task')
  end
end
