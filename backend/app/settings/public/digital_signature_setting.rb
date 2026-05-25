class Public::DigitalSignatureSetting < Settingslogic
  source "#{Rails.root}/config/settings/digital_signature_setting.yml"
  namespace Rails.env

end
