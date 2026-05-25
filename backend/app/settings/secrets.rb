class Secrets < Settingslogic
  source "#{Rails.root}/config/settings/private_settings/secrets.yml"
  namespace Rails.env

  class << self
    def hsm_secret_key
      return @secret_key if @secret_key.present?
      secret_key_path = "#{Rails.root}/config/settings/private_settings/ca_cert_secret.pem"
      raise "ca_cert_secret.pem not exist" unless File.exist?(secret_key_path)
      key_content = File.read(secret_key_path)
      @secret_key = OpenSSL::PKey::RSA.new(key_content)
    end
  end
end
