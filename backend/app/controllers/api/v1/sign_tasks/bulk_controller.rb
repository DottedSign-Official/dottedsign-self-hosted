class Api::V1::SignTasks::BulkController < Api::ApplicationController
  include GroupCheckHelper

  before_action :check_group_bulk_send
  before_action -> { check_emails_if_present(params[:tasks]&.flat_map { |t| Array(t[:stages]).map { |s| s[:email] } }) }, only: [:create_mission]
  before_action :setup_template, only: [:create_mission, :sample]
  before_action :setup_mission, only: [:download]
  def create_mission
    mission = BulkMission.setup_from_request(current_member.id, @template.id, task_infos[:tasks], setting_info: setting_params, client_info: client_params)
    mission.start

    success_response(bulk_uuid: mission.uuid, bulk_count: mission.count)
  end

  def missions
    missions = BulkMission.recent.related_to(current_member).page(params[:page] || 1).per(params[:per_page] || BulkMission::PER_PAGE)
    mission_infos = {
      missions: missions.with_display_content.map(&:display),
      current_page: missions.current_page,
      total_pages: missions.total_pages
    }
    success_response(mission_infos)
  end

  def download
    zip_file = @mission.compress_file
    return error_response(:file_not_ready) if zip_file.nil?
    download_info = zip_file.download
    response.header["Content-Length"] = download_info[:size]
    send_data download_info[:content], filename: download_info[:file_name], type: download_info[:content_type], disposition: 'attachment'
  rescue ServiceError => error
    error_response(error.key)
  end

  def sample
    content = @template.sample_header
    file_name = "template_#{@template.id}_sample_#{Time.current.strftime('%Y%m%d%H%M%S')}.csv"
    response.header["Content-Length"] = content.length
    send_data content, filename: file_name, disposition: 'attachment', type: 'text/csv; charset=utf-8; header=present'
  end

  private

  def check_group_bulk_send
    @group = current_member.group
    check_group('bulk_send') if @group.present?
  end

  def setup_template
    @template = Template.find_by_id(params[:template_id])
    return error_response(:template_not_found) if @template.nil?
    return error_response(:template_deleted) if @template.deleted?
    return error_response(:template_not_accessible) unless @template.accessibility_of(current_member) == :accessible
    return error_response(:template_with_invalid_stage_action) if @template.stages.action_review.present?
  end

  def task_infos
    params.permit(tasks: [:file_name, :message, stages: [:email, :name, :role]])
  end

  def setup_mission
    @mission = BulkMission.find_by_uuid(params[:mission_uuid])
    return error_response(:mission_not_found) if @mission.nil?
    return error_response(:mission_not_ready) unless @mission.completed?
    mission_accessibility = @mission.accessibility_of(current_member)
    return error_response(:no_bulk_send_permission) unless mission_accessibility == :accessible
  end

end
