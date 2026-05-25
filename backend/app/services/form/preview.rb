module Form
  class Preview < ServiceCaller

    def initialize(form_uuid, signer_info)
      @form_uuid = form_uuid
      @signer_info = signer_info
    end

    def call
      verify_for_preview
      @result = @public_form
    end

    private

    def verify_for_preview
      verify = PreviewVerify.call(@form_uuid, @signer_info)
      raise verify.error if verify.failed?
      @public_form = verify.result
    end
  end
end
