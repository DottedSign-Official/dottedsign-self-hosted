module Document
  class SetPassword
    def initialize(file_path, password)
      @path = file_path
      @password = password
    end

    def call
      encrypted_path = output_path
      apply_password(encrypted_path)
      encrypted_path
    end

    private

    def apply_password(encrypted_path)
      PdfEncryptor.encrypt(
        input: @path,
        output: encrypted_path,
        password: @password
      )
    end

    def output_path
      @path.sub(/\.pdf$/i, '_protected.pdf')
    end
  end
end
