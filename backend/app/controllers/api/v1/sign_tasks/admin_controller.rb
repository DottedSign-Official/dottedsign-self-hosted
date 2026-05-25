class Api::V1::SignTasks::AdminController < Api::ApplicationController
  include GroupCheckHelper
  include GroupTaskHelper

  before_action :check_group_feature
  before_action :setup_group
  before_action :check_group_in_belong
  before_action :check_group_view_tasks, except: [:permission, :change_permission]
  before_action :obtain_member_ids, except: [:permission, :change_permission, :reissue]
  before_action :check_group_manage_permission, only: [:permission, :change_permission]

  def tasks
    category = params[:category] || 'waiting_for_group'
    infos = group_task_infos_of_category(category)
    success_response(infos)
  end

  def export
    sign_tasks = get_export_group_tasks
    return error_response(:tasks_too_much) if sign_tasks.length > 10000
    content = format_tasks_csv_string(sign_tasks)
    file_name = 'DottedSign - Search Result.csv'
    send_data content, filename: file_name, disposition: 'attachment', type: 'text/csv; charset=utf-8; header=present'
  end

  def permission
    serialize_response(:role, @group.roles.order(:id), simplified: true)
  end

  def change_permission
    changer = Group::ChangePermission.call(@group, current_member, permission_params[:permissions])
    return error_response(changer.error.key, changer.error.message) if changer.failed?

    serialize_response(:role, @group.roles.order(:id), simplified: true)
  end

  def report
    time_range = format_time_range
    report_service = Report::SummaryGenerator.call(current_member.group_id, @member_ids, time_range, time_zone)
    if report_service.success?
      success_response(report_service.result)
    else
      error_response(report_service.error.key)
    end
  end

  def member_report
    time_range = format_time_range
    report_service = Report::MemberSummaryGenerator.call(current_member.group_id, @member_ids, time_range)
    if report_service.success?
      success_response(report_service.result)
    else
      error_response(report_service.error.key)
    end
  end

  def summary_csv
    time_range = format_time_range
    report_service = Report::SummaryGenerator.call(current_member.group_id, @member_ids, time_range, time_zone, export: true)
    if report_service.success?
      file_name = "DottedSign - Summary reports_#{time_range.first.strftime('%Y%m%d')} to #{time_range.last.strftime('%Y%m%d')}.csv"
      send_data report_service.result, filename: file_name, disposition: 'attachment'
    else
      error_response(report_service.error.key)
    end
  end

  def member_summary_csv
    time_range = format_time_range
    report_service = Report::MemberSummaryGenerator.call(current_member.group_id, @member_ids, time_range, export: true)
    if report_service.success?
      file_name = "DottedSign - User reports_#{time_range.first.strftime('%Y%m%d')} to #{time_range.last.strftime('%Y%m%d')}.zip"
      send_data report_service.result, filename: file_name, disposition: 'attachment'
    else
      error_response(report_service.error.key)
    end
  end
  
  def reissue
    reissue_service = Normal::Reissue.call(params[:sign_task_id], params[:stage_id], current_member, client_params)
    return error_response(reissue_service.error.key) if reissue_service.failed?

    success_response(:ok)
  end

  private

  def obtain_member_ids
    @member_ids = Member.where(email: params[:emails]).pluck(:id).uniq if params[:emails].present?
  end

  def permission_params
    params.require(:permissions)
    params.permit(permissions: [:role, *Settings.default.permissions[:admin]])
  end

end
