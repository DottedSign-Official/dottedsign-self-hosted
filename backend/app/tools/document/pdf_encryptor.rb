require 'shellwords'

module Document
  class PdfEncryptor
    extend CommandExecute

    ENCRYPT_CMD = "qpdf --encrypt %{password} %{password} 256 -- %{input} %{output}".freeze
    QPDF_FAILED_REGEX = /\Aqpdf:\s/i.freeze

    def self.encrypt(input:, output:, password:)
      cmd = ENCRYPT_CMD % {
        password: Shellwords.escape(password.to_s),
        input: Shellwords.escape(input.to_s),
        output: Shellwords.escape(output.to_s)
      }
      result = execute_system_cmd(cmd)
      raise ServiceError.new(:command_execute_failed, error_msg: "pdf encrypt failed: #{result}") if command_failed?(result, failed_regex: QPDF_FAILED_REGEX)
    end
  end
end
