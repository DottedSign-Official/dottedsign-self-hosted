class SignatureProcessWorker < GeneralWorker

  def perform(signature_type, signature_id)
    signature = signature_type.constantize.find_by_id(signature_id)
    return if signature.nil?
    signature.update_to_png!
  end

end
