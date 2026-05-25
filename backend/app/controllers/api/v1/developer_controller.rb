class Api::V1::DeveloperController < Api::ApplicationController
  before_action :check_super_admin
  before_action :setup_task, only: [:task_detail]

  def tasks
    service = Developer::FilteredTaskList.call(task_list_filter_params)
    return error_response(service.error.key) if service.failed?
    serialize_response(:developer_task_list, service.result)
  end

  def task_detail
    serialize_response(:developer_task_detail, @task)
  end

  def task_retry_ca
    task = SignTask.find_by(id: params[:sign_task_id])
    return error_response(:task_not_found) if task.nil?
    CaRetry.ca_retry_now_form_task(task)
    success_response('ok')
  end

  # POST
  def reissue
    reissue_service = Normal::Reissue.call(params[:sign_task_id], params[:stage_id], current_member, client_params)
    return error_response(reissue_service.error.key) if reissue_service.failed?

    success_response(:ok)
  end

  private

  def check_super_admin
    error_response(:only_for_developer) unless current_member.super_admin?
  end

  def setup_task
    @task = SignTask.find_by_id(params[:sign_task_id])
    error_response(:task_not_found) if @task.nil?
  end
end
