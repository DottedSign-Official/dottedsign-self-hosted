class Api::Internal::FilesController < Api::ApplicationController
  skip_before_action :setup_current_member, only: [:download]
  before_action :obtain_service_file, only: [:download]

  def download
    download_info = @service_file.download(params[:attach_type])
    response.header["Content-Length"] = download_info[:size]
    send_data download_info[:content], filename: download_info[:file_name], type: download_info[:content_type], disposition: 'attachment'
  rescue ServiceError => error
    error_response(error.key)
  end

  private

  def obtain_service_file
    @service_file = ServiceFile.retrieve_from_code(params[:code])
    error_response(:file_not_found) if @service_file.nil?
  end
end
