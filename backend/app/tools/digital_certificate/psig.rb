require 'shellwords'

module DigitalCertificate
  class Psig
    extend CommandExecute

    BINARY = Settings.digital_signature.psig.path.freeze

    class << self
      def default_sign_info
        psig = Settings.digital_signature.psig
        {
          reason: psig.reason,
          location: psig.location,
          signature_size: 16384,
          signing_time: nil,
          level: psig.level,
          timestamp_location: psig.timestamp_location,
          tsp_provider: psig.tsp_provider,
          digest_algorithm: psig.digest_algorithm,
          encryption_algorithm: psig.encryption_algorithm,
          timestamp_digest_algorithm: psig.timestamp_digest_algorithm,
          signer_certificate_file: nil,
          certificate_files: nil,
          key_store_type: nil,
          key_store_file: psig.key_store_file,
          key_store_password: psig.key_store_password,
          visible_signature_page: nil,
          visible_signature_rect: nil,
          visible_signature_image_file: nil,
          permission: nil,
        }
      end

      def sign_prepare(input_file, tbs_file, sign_info, pdf_password: nil)
        execute_system_cmd(build_prepare_cmd(input_file, tbs_file, sign_info, pdf_password: pdf_password))
      end

      def sign_complete(input_file, raw_signature_file, output_file, sign_info, pdf_password: nil)
        execute_system_cmd(build_complete_cmd(input_file, raw_signature_file, output_file, sign_info, pdf_password: pdf_password))
      end

      def sign(input_file, output_file, sign_info, pdf_password: nil)
        execute_system_cmd(build_sign_cmd(input_file, output_file, sign_info, pdf_password: pdf_password))
      end

      private

      def build_prepare_cmd(input_file, tbs_file, sign_info, pdf_password: nil)
        parts = [
          shellescape(BINARY), 'sign-prepare',
          opt('--input-file', input_file),
          opt('--tbs-file', tbs_file),
          opt('--signer-certificate-file', sign_info[:signer_certificate_file]),
          opt('--reason', sign_info[:reason]),
          opt('--location', sign_info[:location]),
          opt('--signature-size', sign_info[:signature_size]),
          opt('--signing-time', sign_info[:signing_time]),
          opt('--pdf-password', pdf_password)
        ]
        parts.compact.join(' ')
      end

      def build_complete_cmd(input_file, raw_signature_file, output_file, sign_info, pdf_password: nil)
        cert_flags = Array(sign_info[:certificate_files]).map { |f| opt('--certificate-file', f) }
        parts = [
          shellescape(BINARY), 'sign-complete',
          opt('--input-file', input_file),
          opt('--raw-signature-file', raw_signature_file),
          opt('--output-file', output_file),
          opt('--signer-certificate-file', sign_info[:signer_certificate_file]),
          opt('--reason', sign_info[:reason]),
          opt('--location', sign_info[:location]),
          opt('--signature-size', sign_info[:signature_size]),
          opt('--signing-time', sign_info[:signing_time]),
          opt('--level', sign_info[:level]),
          opt('--timestamp-location', sign_info[:timestamp_location]),
          opt('--tsp-provider', sign_info[:tsp_provider]),
          *cert_flags,
          opt('--pdf-password', pdf_password)
        ]
        parts.compact.join(' ')
      end

      def build_sign_cmd(input_file, output_file, sign_info, pdf_password: nil)
        parts = [
          shellescape(BINARY), 'sign',
          opt('--input-file', input_file),
          opt('--output-file', output_file),
          opt('--reason', sign_info[:reason]),
          opt('--location', sign_info[:location]),
          opt('--signature-size', sign_info[:signature_size]),
          opt('--level', sign_info[:level]),
          opt('--key-store-type', sign_info[:key_store_type]),
          opt('--key-store-file', sign_info[:key_store_file]),
          opt('--key-store-password', sign_info[:key_store_password]),
          opt('--timestamp-location', sign_info[:timestamp_location]),
          opt('--tsp-provider', sign_info[:tsp_provider]),
          opt('--digest-algorithm', sign_info[:digest_algorithm]),
          opt('--encryption-algorithm', sign_info[:encryption_algorithm]),
          opt('--timestamp-digest-algorithm', sign_info[:timestamp_digest_algorithm]),
          opt('--visible-signature-page', sign_info[:visible_signature_page]),
          opt('--visible-signature-rect', sign_info[:visible_signature_rect]),
          opt('--visible-signature-image-file', sign_info[:visible_signature_image_file]),
          opt('--permission', sign_info[:permission]),
          opt('--pdf-password', pdf_password)
        ]
        parts.compact.join(' ')
      end

      def opt(flag, value)
        return nil if value.nil?
        "#{flag} #{shellescape(value)}"
      end

      def shellescape(value)
        Shellwords.shellescape(value.to_s)
      end
    end
  end
end
