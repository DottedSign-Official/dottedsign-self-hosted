require 'openssl'
require 'base64'
require 'json'

module OnPremiseLicense
  module PlanReader
    LICENSE_PATH = ENV.fetch(
      'LICENSE_KEY_PATH',
      File.expand_path('../../config/license.key', __dir__)
    )
    PUBLIC_PEM_PATH = ENV.fetch(
      'LICENSE_PUBLIC_PEM_PATH',
      File.expand_path('../../config/on_premise_rsa/license/public.pem', __dir__)
    )

    ENTERPRISE = 'enterprise'

    class << self
      def plan
        return @plan if defined?(@plan)
        @plan = read_plan
      end

      def enterprise?
        plan == ENTERPRISE
      end

      def reset!
        remove_instance_variable(:@plan) if defined?(@plan)
      end

      private

      def read_plan
        return nil unless File.exist?(LICENSE_PATH) && File.exist?(PUBLIC_PEM_PATH)
        envelope = JSON.parse(Base64.decode64(strip_boundary(File.read(LICENSE_PATH))))
        return nil unless %w[data key iv].all? { |k| envelope[k] }

        pub = OpenSSL::PKey::RSA.new(File.read(PUBLIC_PEM_PATH))
        aes_key = pub.public_decrypt(Base64.decode64(envelope['key']))
        iv      = Base64.decode64(envelope['iv'])

        cipher = OpenSSL::Cipher::AES128.new(:CBC)
        cipher.decrypt
        cipher.key = aes_key
        cipher.iv  = iv
        json_text  = cipher.update(Base64.decode64(envelope['data'])) + cipher.final

        attrs = JSON.parse(json_text)
        attrs.dig('restrictions', 'plan')
      rescue StandardError
        nil
      end

      def strip_boundary(data)
        after_start = data.split(/(\A|\r?\n)-*BEGIN .+? LICENSE-*\r?\n/).last
        after_start.split(/\r?\n-*END .+? LICENSE-*(\r?\n|\z)/).first
      end
    end
  end
end
