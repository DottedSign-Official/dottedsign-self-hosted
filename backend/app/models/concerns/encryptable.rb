module Encryptable
  extend ActiveSupport::Concern

  class_methods do
    def encryptable(*fields)
      fields.each do |field|
        define_method(field) do
          return instance_variable_get("@decoded_#{field}") if instance_variable_defined?("@decoded_#{field}")

          decrypt_value = super().blank? ? super() : encryptor.decrypt_and_verify(super())

          instance_variable_set("@decoded_#{field}", decrypt_value)
          decrypt_value
        end

        define_method("#{field}=") do |value|
          remove_instance_variable("@decoded_#{field}") if instance_variable_defined?("@decoded_#{field}")

          encrypt_value = value.blank? ? value : encryptor.encrypt_and_sign(value)

          super(encrypt_value)
        end
      end
    end
  end

  private

  def encryptor
    ActiveSupport::MessageEncryptor.new(Secrets.record_encryption.key)
  end
end