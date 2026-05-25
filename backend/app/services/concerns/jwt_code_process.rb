module JwtCodeProcess

  def generate_code(payload, expires_in: nil)
    payload[:expired_at] = Time.now.to_i + expires_in.to_i if expires_in.present?
    JWT.encode(payload, Secrets.jwt.secret, Secrets.jwt.encode_algorithm)
  end

  def verify_code(jwt_code)
    return @code_info if @code_info.present?
    @code_info, header = JWT.decode(jwt_code, Secrets.jwt.secret, true, { algorithm: Secrets.jwt.encode_algorithm })
    @code_info.symbolize_keys!
  rescue JWT::DecodeError, JWT::ExpiredSignature
    nil
  end

  def code_match?(jwt_code, matched_info, matched_columns: [])
    return false if verify_code(jwt_code).nil?
    (@code_info.slice(*matched_columns).to_a - matched_info.slice(*matched_columns).to_a).blank?
  end

  def code_expired?(jwt_code)
    return true if verify_code(jwt_code).nil?
    return false if @code_info[:expired_at].nil?
    @code_info[:expired_at] <= Time.zone.now.to_i
  end

end
