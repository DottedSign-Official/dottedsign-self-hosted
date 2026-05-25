class Api::V1::GeneralController < Api::ApplicationController
  skip_before_action :setup_current_member, only: [:health_check, :license_info]

  def country_list
    list = CountryInfo.list(params[:lang] || Settings.default.lang)
    success_response(list)
  end

  def health_check
    success_response
  end

  def license_info
    service = OnPremiseLicense::Info.call
    return error_response(service.error.key) if service.failed?
    success_response(service.result)
  end

end
