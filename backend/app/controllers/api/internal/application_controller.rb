class Api::Internal::ApplicationController < Api::ApplicationController

  private

  def setup_current_member
    return @current_member if @current_member.present?

    @current_member = find_member_by_id_or_email
    return error_response(:member_not_found) if @current_member.nil?
  end

  def find_member_by_id_or_email
    Member.find_by(id: params[:member_id]) || Member.find_by(email: params[:member_email])
  end
end
