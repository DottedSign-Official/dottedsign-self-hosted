class Api::V1::SignTasks::NotifyController < Api::ApplicationController
  before_action :security_checked
  before_action :setup_task
  before_action :check_email, only: [:email_signer]
  before_action :setup_signer_stage, only: [:email_signer]
  before_action :check_ownership, only: [:email_signer]

  def email_me
    backup_file = @task.completed? ? @task.completed_file : @task.original_file
    return error_response(:file_not_ready) if backup_file.nil?
    Notification::BackupMailWorker.perform_async(current_member.email, current_member.display_name, @task.file_name, backup_file.id)
    success_response(:ok)
  end

  def email_signer
    Notification::ProcessingMailWorker.new.perform(@signer_stage.id, @signer_stage.class.base_class.name)
    success_response(email: @signer_stage.email)
  rescue => error
    error_response(:mail_failed, error.message)
  end

  def remind_now
    reminded_emails = @task.remind_now

    if reminded_emails.nil?
      error_response(:task_not_waiting)
    else
      success_response(reminded_emails: reminded_emails)
    end
  end

  private

  def setup_signer_stage
    @signer_stage = @envelope.present? ? @envelope.processing_stages.find_by("actor_info->>'email' = ?", params[:email])
                                       : @task.processing_stages.find_by_email(params[:email])
    return error_response(:stage_not_found) if @signer_stage.nil?
  end
end
