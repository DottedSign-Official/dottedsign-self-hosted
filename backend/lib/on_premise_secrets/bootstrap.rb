# frozen_string_literal: true

require 'securerandom'
require 'openssl'
require 'fileutils'
require 'yaml'
require 'active_support'
require 'active_support/encrypted_configuration'

module OnPremiseSecrets
  class Bootstrap
    def initialize(root: File.expand_path('../..', __dir__))
      @root = root
    end

    def call
      ensure_master_key_and_credentials
      ensure_password_rsa
    end

    private

    def path(*parts)
      File.join(@root, *parts)
    end

    def master_key_path
      path('config', 'master.key')
    end

    def credentials_path
      path('config', 'credentials.yml.enc')
    end

    def rsa_private_path
      path('config', 'on_premise_rsa', 'password', 'private.pem')
    end

    def rsa_public_path
      path('config', 'on_premise_rsa', 'password', 'public.pem')
    end

    def ensure_master_key_and_credentials
      return if File.exist?(master_key_path) && File.exist?(credentials_path)

      unless File.exist?(master_key_path)
        FileUtils.mkdir_p(File.dirname(master_key_path))
        File.write(master_key_path, SecureRandom.hex(16))
        FileUtils.chmod(0o600, master_key_path)
        FileUtils.rm_f(credentials_path)
      end

      write_credentials
    end

    def write_credentials
      FileUtils.mkdir_p(File.dirname(credentials_path))
      config = ActiveSupport::EncryptedConfiguration.new(
        config_path: credentials_path,
        key_path: master_key_path,
        env_key: 'RAILS_MASTER_KEY',
        raise_if_missing_key: true
      )
      config.write({ 'secret_key_base' => SecureRandom.hex(64) }.to_yaml)
    end

    def ensure_password_rsa
      if File.exist?(rsa_private_path)
        unless File.exist?(rsa_public_path)
          rsa = OpenSSL::PKey::RSA.new(File.read(rsa_private_path))
          File.write(rsa_public_path, rsa.public_key.to_pem)
        end
        return
      end

      FileUtils.mkdir_p(File.dirname(rsa_private_path))
      rsa = OpenSSL::PKey::RSA.new(2048)
      File.write(rsa_private_path, rsa.to_pem)
      FileUtils.chmod(0o600, rsa_private_path)
      File.write(rsa_public_path, rsa.public_key.to_pem)
    end
  end
end
