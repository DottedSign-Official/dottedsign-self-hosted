# frozen_string_literal: true

LeveretAuth.configure do
  devise_for :members

  before_user_save do |user|
    user.is_registered = true
  end

  if ActiveModel::Type::Boolean.new.cast(ENV['LEVERET_AUTH_LDAP_ENABLE'])
    add_provider :ldap, file_path: ENV['LEVERET_AUTH_LDAP_FILE_PATH']
  end
end
