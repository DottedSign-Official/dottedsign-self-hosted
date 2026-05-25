class Api::V1::SignTasks::AuditController < Api::ApplicationController
  before_action :security_checked
  before_action :setup_task
  before_action :check_accessibility, only: [:audit_trail]
  before_action :check_download_audit_accessibility, only: [:audit_trail_pdf]
  before_action :check_available

  def audit_trail_pdf
    unfinished_error_key = @source.is_a?(Envelope) ? :envelope_is_not_finished : :task_is_not_finished
    return error_response(unfinished_error_key) unless @source.finished?

    download_info = @source.audit_trails_pdf_download_info
    return error_response(:get_trial_pdf_failed) if download_info[:content].nil?

    response.header["Content-Length"] = download_info[:size]
    send_data download_info[:content], filename: download_info[:file_name], type: download_info[:content_type], disposition: 'attachment'
  end

  def audit_trail
    audit_trail = SignEvent.audit_trail_for(@source, current_member.id)
    success_response(audit_trail)
  end

  private

  def check_download_audit_accessibility
    check_accessibility('download_audit_trail')
  end

end
