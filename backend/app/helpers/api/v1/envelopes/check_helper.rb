module Api::V1::Envelopes::CheckHelper

  def check_and_setup_envelope
    @envelope = Envelope.includes(:sign_tasks).find_by_id((params[:envelope_id] || @code_info['envelope_id']).to_i)
    return error_response(:envelope_not_found) if @envelope.nil?
  end

end
