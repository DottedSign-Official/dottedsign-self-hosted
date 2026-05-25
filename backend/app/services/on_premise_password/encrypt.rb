module OnPremisePassword
  class Encrypt < ServiceCaller
    def initialize(password)
      @password = password.to_s
    end

    def call
      setup_rsa_public_key
      @result = encrypt_base64_password
    end

    private

    def setup_rsa_public_key
      raise ServiceError.new(:missing_private_rsa) unless File.exist?(public_key_path)

      public_pem = File.read(public_key_path)
      @rsa = OpenSSL::PKey::RSA.new(public_pem)
    end

    def encrypt_base64_password
      Base64.encode64(@rsa.public_encrypt(@password))
    rescue
      raise ServiceError.new(:encrypt_failed)
    end

    def public_key_path
      "#{Settings.on_premise.password.rsa_dir}/#{Settings.on_premise.password.public_key}"
    end
  end
end
