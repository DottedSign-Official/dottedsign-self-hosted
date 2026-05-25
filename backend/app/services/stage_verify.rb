class StageVerify < ServiceCaller

  def initialize(stage, verify_info, client_info, execute_type: 'normal', verify_occassion: 'sign')
    @stage = stage
    @verify_info = verify_info || {}
    @client_info = client_info
    @execute_type = execute_type || 'normal'
    @verify_occassion = verify_occassion || 'sign'
    @verify_event_infos = []
  end

  def call
    identity_verify

    @result = {
      verify_event_infos: @verify_event_infos,
      identity_verify_token: @identity_verify_token,
    }
  end

  private

  def identity_verify
    verify = Verification::IdentityVerify.call(@stage, @verify_info, @client_info, execute_type: @execute_type, verify_occassion: @verify_occassion)
    raise verify.error if verify.failed?
    verify_detail = verify.result
    return if verify_detail.nil?
    prepare_verify_event_infos(verify_detail)
    @identity_verify_token = verify_detail[:other_info][:identity_verify_token]
  end

  def prepare_verify_event_infos(verify_detail)
    verify_detail[:execute_type] = @execute_type
    verify_detail[:created_at] = Time.at(verify_detail[:other_info][:verify_at])
    @verify_event_infos << verify_detail
  end

end
