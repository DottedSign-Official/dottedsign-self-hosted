LICENSE_KEY = File.exist?('config/license.key') ? File.read('config/license.key') : nil

Rails.application.reloader.to_prepare do
  verify = OnPremiseLicense::Verify.call(LICENSE_KEY)
  raise verify.error if verify.failed?

  # Group setting
  group_enable = verify.license.restrictions[:group_enable] rescue false
  group_use = ActiveRecord::Type::Boolean.new.serialize(ENV['GROUP_USE'])
  GROUP_USE = group_use.nil? ? group_enable : (group_enable && group_use)

  # Template setting
  group_template_share_enable = verify.license.restrictions[:template]["group_share"] rescue false
  group_template_share_use = ActiveRecord::Type::Boolean.new.serialize(ENV['GROUP_TEMPLATE_SHARE_ENABLE'])
  GROUP_TEMPLATE_SHARE_ENABLE = group_template_share_use.nil? ? group_template_share_enable : (group_template_share_enable && group_template_share_use)

  # CA setting
  system_ca_enable = verify.license.restrictions[:certificate_authority]["system_ca_enable"] rescue false
  system_ca_use = ActiveRecord::Type::Boolean.new.serialize(ENV['SYSTEM_CA_USE'])
  SYSTEM_CA_USE = system_ca_use.nil? ? system_ca_enable : (system_ca_enable && system_ca_use)
end
