require 'gitlab/license'
require 'openssl'
require 'tmpdir'
require 'fileutils'

module LicenseFixtureBuilder
  module_function

  # Returns { license_path:, public_pem_path:, plan: }
  def build(plan:, dir: Dir.mktmpdir('license_fixture'))
    previous_key = Gitlab::License.encryption_key
    keypair = OpenSSL::PKey::RSA.new(2048)
    public_pem_path = File.join(dir, 'public.pem')
    File.write(public_pem_path, keypair.public_key.to_pem)

    Gitlab::License.encryption_key = keypair

    license = Gitlab::License.new
    license.licensee   = { 'name' => 'Test', 'email' => 'test@kdanmobile.com', 'company' => 'KDAN' }
    license.starts_at  = Date.new(2026, 1, 1)
    license.expires_at = Date.new(2030, 12, 31)
    license.restrictions = { plan: plan }

    license_path = File.join(dir, 'license.key')
    File.write(license_path, license.export)

    { license_path: license_path, public_pem_path: public_pem_path, plan: plan, dir: dir }
  ensure
    Gitlab::License.encryption_key = previous_key
  end

  def cleanup(fixture)
    FileUtils.remove_entry(fixture[:dir]) if fixture && fixture[:dir] && File.exist?(fixture[:dir])
  end
end
