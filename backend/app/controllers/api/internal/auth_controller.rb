class Api::Internal::AuthController < Api::Internal::ApplicationController
  before_action :setup_application, only: [:obtain_member_token]
  skip_before_action :setup_current_member, only: [:obtain_member_token]

  include MemberHelper

  def obtain_member_token
    member = Member.registered.find_by(email: params[:email])
    return error_response(:member_not_found) if member.nil?
    success_response(member.token_info(@app).merge(member_id: member.id))
  end

end
