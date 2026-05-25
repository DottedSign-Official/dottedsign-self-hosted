# frozen_string_literal: true

require 'secret-keeper'
require_relative '../../app/services/on_premise_password/encrypt'

namespace :config do
  desc 'pull Cloudconig from bitbucket and encrypt files'
  task :encrypt_files do
    SecretKeeper.encrypt_files
  end

  desc 'decrypt *.enc files to its location'
  task :decrypt_files do
    SecretKeeper.decrypt_files
  end

  desc 'encrypt the password from public key'
  task :encrypt_password, [:password] do |_, args|
    encrypter = OnPremisePassword::Encrypt.call(args[:password])
    raise encrypter.error if encrypter.failed?

    print encrypter.result.gsub("\n", '')
  end
end
