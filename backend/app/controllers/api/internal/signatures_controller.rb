class Api::Internal::SignaturesController < Api::Internal::ApplicationController
  skip_before_action :setup_current_member, only: [:show]

  def show
    signature = Signature.find_by(id: signature_video_params[:id])
    return error_response(:signature_not_found) if signature.nil?
    response = signature.as_json
    response.merge!({
      'raw' => signature.raw_file_base64,
      'sign_video' => SignatureVideo::FetchBase64.call(signature_video_params[:id]).result
    })
    success_response(response)
  end

  private

  def signature_video_params
    require_attrs = [:id]
    params.require(require_attrs)
    params.permit(*require_attrs)
  end
end
