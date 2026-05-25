class Api::V1::SignTasks::SearchController < Api::ApplicationController
  before_action :security_checked

  def search
    search_service = TaskSearcher.call(current_member, search_params, pagination_params)
    return error_response(search_service.error) if search_service.failed?
    success_response(search_service.result)
  end

  private

  def search_params
    params[:search_tags] = Array(params[:search_tags]).compact_blank
    params.permit(:target, :terms, :start_from, :end_at, search_tags: [])
  end
end
