class Api::V1::FilesController < Api::ApplicationController
  # authentication for quick sign (in CodeAuthenticationHelper)
  prepend_before_action :allow_code_authentication_strategy, only: [:download_attachment]

  skip_before_action :setup_current_member, except: [:download_attachment]
  before_action :check_file_type!, only: [:upload]
  before_action :obtain_service_file, except: [:download_attachment]

  def upload
    if @service_file.upload(params[:file], upload_code: params[:code])
      success_response(:ok)
    else
      error_response(:upload_file_failed)
    end
  end

  def download
    params[:attach_type] ||= 'file'
    download_info = @service_file.download(params[:attach_type])
    response.header["Content-Length"] = download_info[:size]
    send_data download_info[:content], filename: download_info[:file_name], type: download_info[:content_type], disposition: 'attachment'
  rescue ServiceError => error
    error_response(error.key)
  end

  def download_attachment
    attachment_checker = AttachmentChecker.call(params.require(:file_id).to_i, current_member)
    return error_response(attachment_checker.error.key) if attachment_checker.failed?
    service_file = attachment_checker.result
    download_info = service_file.download
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

  def check_file_type!
    file_path = params[:file].tempfile.path
    file = File.open(file_path)
    file_type = MimeMagic.by_magic(file)&.type&.split('/')&.last
    error_response(:invalid_file_type) if ServiceFile::ALLOW_FILE_TYPES.exclude?(file_type)
  end

end
