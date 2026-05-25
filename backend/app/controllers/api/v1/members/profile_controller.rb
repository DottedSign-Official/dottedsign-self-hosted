class Api::V1::Members::ProfileController < Api::ApplicationController
  before_action -> { check_email_if_present(params[:email]) }, only: [:update]

  def show
    profile_data = current_member.profile_public_info
    success_response(profile_data)
  end

  def update
    current_member.profile.update(profile_params)
    success_response(current_member.profile_public_info)
  end

  private

  def profile_params
    params.permit(:full_name, :first_name, :telephone, :nationality, :address, :organization, :email)
  end

end
