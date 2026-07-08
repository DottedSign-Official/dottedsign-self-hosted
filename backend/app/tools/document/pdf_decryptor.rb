require 'shellwords'

module Document
  class PdfDecryptor
    extend CommandExecute

    DECRYPT_CMD = "qpdf --password=%{password} --decrypt %{input} %{output}".freeze
    QPDF_FAILED_REGEX = /\Aqpdf:\s/i.freeze

    def self.decrypt(input:, output:, password:)
      cmd = DECRYPT_CMD % {
        password: Shellwords.escape(password.to_s),
        input: Shellwords.escape(input.to_s),
        output: Shellwords.escape(output.to_s)
      }
      result = execute_system_cmd(cmd)
      raise ServiceError.new(:command_execute_failed, error_msg: "pdf decrypt failed: #{result}") if command_failed?(result, failed_regex: QPDF_FAILED_REGEX)
    end
  end
end
