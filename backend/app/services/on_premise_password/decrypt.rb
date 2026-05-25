module OnPremisePassword
  class Decrypt < ServiceCaller
    def initialize(encrypted_base64_password)
      @encrypted_base64_password = encrypted_base64_password.to_s
    end

    def call
      setup_rsa_private_key
      @result = decrypt_base64_password
    end

    private

    def setup_rsa_private_key
      raise ServiceError.new(:missing_private_rsa) unless File.exist?(private_key_path)

      private_pem = File.read(private_key_path)
      @rsa = OpenSSL::PKey::RSA.new(private_pem)
    end

    def decrypt_base64_password
      @rsa.private_decrypt(Base64.decode64(@encrypted_base64_password))
    rescue
      raise ServiceError.new(:invalid_password)
    end

    def private_key_path
      "#{Settings.on_premise.password.rsa_dir}/#{Settings.on_premise.password.private_key}"
    end
  end
end
