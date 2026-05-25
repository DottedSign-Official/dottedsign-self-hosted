class Object
  def env_presence(allow_blank: false)
    return self if self.nil? || self.boolean?
    return true if self.is_a?(String) && self.downcase == 'true'
    return false if self.is_a?(String) && self.downcase == 'false'

    allow_blank ? self : self.presence
  end

  def boolean?
    self.is_a?(TrueClass) || self.is_a?(FalseClass)
  end

  def base64?
    base64_regex = %r{\A(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?\z}

    return false unless self.is_a?(String)
    return false unless self.match?(base64_regex)

    begin
      Base64.decode64(self)
      true
    rescue
      false
    end
  end
end
