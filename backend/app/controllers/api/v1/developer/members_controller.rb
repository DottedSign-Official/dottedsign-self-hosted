class Api::V1::Developer::MembersController < Api::V1::DeveloperController
  before_action :check_email, only: [:modify_status]

  def index
    service = Developer::ShowMemberList.call(list_params[:search_email], list_params[:filter_status], list_params[:filter_none_group],
                                             list_params[:search_group_name], list_params[:page], list_params[:per_page])
    serialize_response(:member_list, service.result, show_group_info: true)
  end

  def modify_status
    return error_response(:invalid_params) if Member.statuses.keys.exclude?(modify_status_params[:status])
    member = Member.find_by(email: modify_status_params[:email])
    return error_response(:member_not_found) if member.nil?
    member.update!(status: modify_status_params[:status])
    success_response
  end

  private

  def list_params
    require_attrs = [:search_email, :filter_status, :filter_none_group, :search_group_name, :page, :per_page]
    params.permit(*require_attrs)
  end

  def modify_status_params
    require_attrs = [:email, :status]
    params.require(require_attrs)
    params.permit(*require_attrs)
  end

end
