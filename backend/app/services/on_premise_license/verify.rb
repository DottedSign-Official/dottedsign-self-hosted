module OnPremiseLicense
  class Verify < ServiceCaller
    attr_reader :license

    def initialize(license_data)
      @license_data = license_data
    end

    def call
      setup_rsa_public_key
      import_license
      @result = @license
    end

    private

    def setup_rsa_public_key
      raise ServiceError(:missing_public_rsa) unless File.exist?("#{Settings.on_premise.license.rsa_dir}/public.pem")
      public_pem = File.read("#{Settings.on_premise.license.rsa_dir}/public.pem")
      @public_key = OpenSSL::PKey::RSA.new(public_pem)
    end

    def import_license
      Gitlab::License.encryption_key = @public_key
      @license = Gitlab::License.import(@license_data)
      raise ServiceError.new(:invalid_license) if @license.nil?
      raise ServiceError.new(:invalid_license) if @license.expires_at.present? && @license.expires_at <= Time.zone.now
    rescue Gitlab::License::ImportError => e
      raise ServiceError.new(:invalid_license, error_message: "#{e.class.name}: #{e.message}")
    end

  end
end
