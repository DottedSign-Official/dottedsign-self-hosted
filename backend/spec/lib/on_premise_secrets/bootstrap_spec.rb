require 'spec_helper'
require 'tmpdir'
require 'yaml'
require 'openssl'
require 'active_support'
require 'active_support/encrypted_configuration'
require_relative '../../../lib/on_premise_secrets/bootstrap'

RSpec.describe OnPremiseSecrets::Bootstrap do
  around do |example|
    Dir.mktmpdir do |dir|
      @root = dir
      example.run
    end
  end

  def path(*parts) = File.join(@root, *parts)
  def master_key_path = path('config', 'master.key')
  def credentials_path = path('config', 'credentials.yml.enc')
  def rsa_private_path = path('config', 'on_premise_rsa', 'password', 'private.pem')
  def rsa_public_path = path('config', 'on_premise_rsa', 'password', 'public.pem')

  def run! = described_class.new(root: @root).call

  describe 'master.key and credentials' do
    it 'generates master.key and credentials containing secret_key_base when neither exists' do
      run!

      expect(File.read(master_key_path).strip.length).to eq(32)
      decrypted = ActiveSupport::EncryptedConfiguration.new(
        config_path: credentials_path, key_path: master_key_path,
        env_key: 'RAILS_MASTER_KEY', raise_if_missing_key: true
      ).read
      expect(YAML.safe_load(decrypted)['secret_key_base'].length).to eq(128)
    end

    it 'does not overwrite when both exist (generate-once)' do
      FileUtils.mkdir_p(File.dirname(master_key_path))
      File.write(master_key_path, 'existing-master-key-value-000000')
      FileUtils.mkdir_p(File.dirname(credentials_path))
      File.write(credentials_path, 'SENTINEL')

      run!

      expect(File.read(master_key_path)).to eq('existing-master-key-value-000000')
      expect(File.read(credentials_path)).to eq('SENTINEL')
    end

    it 'rebuilds credentials with the existing master.key when master.key exists but credentials are missing' do
      FileUtils.mkdir_p(File.dirname(master_key_path))
      File.write(master_key_path, SecureRandom.hex(16))
      original_key = File.read(master_key_path)

      run!

      expect(File.read(master_key_path)).to eq(original_key)
      decrypted = ActiveSupport::EncryptedConfiguration.new(
        config_path: credentials_path, key_path: master_key_path,
        env_key: 'RAILS_MASTER_KEY', raise_if_missing_key: true
      ).read
      expect(YAML.safe_load(decrypted)['secret_key_base'].length).to eq(128)
    end

    it 'generates a new master.key and replaces stale credentials with new content when master.key is missing but old credentials exist' do
      FileUtils.mkdir_p(File.dirname(credentials_path))
      File.write(credentials_path, 'STALE-OLD-CREDENTIALS')

      run!

      expect(File.read(master_key_path).strip.length).to eq(32)
      decrypted = ActiveSupport::EncryptedConfiguration.new(
        config_path: credentials_path, key_path: master_key_path,
        env_key: 'RAILS_MASTER_KEY', raise_if_missing_key: true
      ).read
      expect(YAML.safe_load(decrypted)['secret_key_base'].length).to eq(128)
    end
  end

  describe 'password RSA' do
    it 'generates a usable RSA private key and matching public key when none exist' do
      run!
      private_rsa = OpenSSL::PKey::RSA.new(File.read(rsa_private_path))
      expect(private_rsa.private?).to be(true)
      expect(File.read(rsa_public_path)).to eq(private_rsa.public_key.to_pem)
    end

    it 'does not overwrite an existing private key and rebuilds the missing public key from it' do
      FileUtils.mkdir_p(File.dirname(rsa_private_path))
      existing = OpenSSL::PKey::RSA.new(2048)
      File.write(rsa_private_path, existing.to_pem)

      run!

      expect(File.read(rsa_private_path)).to eq(existing.to_pem)
      expect(File.read(rsa_public_path)).to eq(existing.public_key.to_pem)
    end
  end
end
