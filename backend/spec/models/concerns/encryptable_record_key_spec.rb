require 'rails_helper'

# The record_encryption key is provided solely by the RECORD_ENCRYPTION_KEY
# environment variable; there is no longer a persistent key file or hardcoded
# default value. The ERB logic in secrets.yml is
# `ENV['RECORD_ENCRYPTION_KEY'].env_presence || raise(...)`, so it raises when
# unset or left empty. Settingslogic's `reload!` sets @instance = nil, then
# re-reads the file and re-runs the ERB (see the settingslogic gem's
# `reload!` -> `load!` -> `initialize`, which runs
# `YAML.load(ERB.new(file_contents).result)`). Therefore, after setting ENV
# within the same process, calling `Secrets.reload!` reflects the new value or
# triggers the raise without restarting the process.
RSpec.describe 'record_encryption key resolution (provided by ENV only)' do
  around do |example|
    original_env = ENV['RECORD_ENCRYPTION_KEY']
    example.run
  ensure
    if original_env.nil?
      ENV.delete('RECORD_ENCRYPTION_KEY')
    else
      ENV['RECORD_ENCRYPTION_KEY'] = original_env
    end
    Secrets.reload!
  end

  it 'uses the ENV value for Secrets.record_encryption.key when ENV is set' do
    strong_value = SecureRandom.hex(16)
    ENV['RECORD_ENCRYPTION_KEY'] = strong_value
    Secrets.reload!

    expect(Secrets.record_encryption.key).to eq(strong_value)
  end

  it 'raises when loading secrets while ENV is unset (no file or default fallback anymore)' do
    ENV.delete('RECORD_ENCRYPTION_KEY')

    expect { Secrets.reload! }.to raise_error(/RECORD_ENCRYPTION_KEY/)
  end

  it 'treats an empty ENV string as unset and raises' do
    ENV['RECORD_ENCRYPTION_KEY'] = ''

    expect { Secrets.reload! }.to raise_error(/RECORD_ENCRYPTION_KEY/)
  end
end
