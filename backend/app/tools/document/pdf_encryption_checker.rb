require 'shellwords'

module Document
  class PdfEncryptionChecker
    extend CommandExecute

    CHECK_ENCRYPTION_CMD = 'qpdf --show-encryption %{input} 1>&2'.freeze
    NOT_ENCRYPTED_OUTPUT = 'File is not encrypted'.freeze
    ENCRYPTED_OUTPUT_REGEX = /^\s*R = \d+\s*$/m

    class << self
      def encrypted?(input:)
        raise ServiceError.new(:file_not_found, error_message: "input file not found: #{input}") unless File.exist?(input)

        cmd = CHECK_ENCRYPTION_CMD % { input: Shellwords.escape(input.to_s) }
        result = execute_system_cmd(cmd)

        return false if result.include?(NOT_ENCRYPTED_OUTPUT)
        return true if result.match?(ENCRYPTED_OUTPUT_REGEX)

        raise ServiceError.new(:command_execute_failed, error_message: "pdf encryption check failed: #{result}")
      end
    end
  end
end
