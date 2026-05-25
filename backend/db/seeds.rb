# Create application
app_name = ENV['AUTH_CLIENT_NAME'].env_presence || 'Default App'
app = Doorkeeper::Application.find_by(name: app_name)
if app.nil?
  app = Doorkeeper::Application.create!(
    name: app_name,
    confidential: true,
    uid: ENV['AUTH_CLIENT_ID'] || SecureRandom.hex(32),
    secret: ENV['AUTH_CLIENT_SECRET'] || SecureRandom.hex(32)
  )
  puts "[SEED] Created application: #{app.name}"
else
  puts "[SEED] Application already exists: #{app.name}"
end

# Create country infos
countries = File.read('lib/country.json')
countries = JSON.parse(countries)
countries.each do |country|
  country_info = CountryInfo.find_or_initialize_by(alpha2: country['alpha2'])
  country_info.assign_attributes(country)
  country_info.save
end
puts "[SEED] Created #{CountryInfo.count} country infos safely."

# Create system reserved decline reasons
system_reserved_reasons = [
    { content: 'sign_online_concern', system_reserved: true },
    { content: 'document_content_error', system_reserved: true },
    { content: 'not_signer', system_reserved: true },
    { content: 'not_interested', system_reserved: true },
    { content: 'others', system_reserved: true }
]
DeclineReason.create(system_reserved_reasons) # validate duplication in model
puts "[SEED] Created #{DeclineReason.count} decline reasons safely."

# Create default avatar for members
avatar = ServiceFile.find_by(label: 'default_avatar')
if avatar
  puts "[SEED] Default avatar already exists."
else
  file = Rails.root.join('public', 'user_icon.png')
  image = Image.create!
  image.upload_service_file('default_avatar', io: File.open(file), content_type: 'image/png', filename: 'user_icon.png', skip_callback: true)
  puts "[SEED] Created default avatar."
end

# Create member from environment variables
if ENV['MEMBER']
  member = Member.find_or_initialize_by(email: ENV['MEMBER'])
  if member.new_record?
    member.assign_attributes(from_application_id: app.id, is_registered: true, confirmed_at: Time.zone.now)
    member.password = ENV['MEMBER_PASSWORD'] || OnPremisePassword::Decrypt.call(ENV['CRYPTO_MEMBER_PASSWORD'].env_presence)&.result || '00000000'
    member.save
    member.generate_group(Settings.default_group.name) if GROUP_USE && member.group.nil?
    puts "[SEED] Created member with group: #{ENV['MEMBER']}"
  else
    puts "[SEED] Member already exists: #{ENV['MEMBER']}"
  end
else
  puts "[SEED] No member found."
end

# Create super admin from environment variables
if ENV['SUPER_ADMIN']
  admins = ENV['SUPER_ADMIN'].split(',')
  password = ENV['SUPER_ADMIN_PASSWORD'] || OnPremisePassword::Decrypt.call(ENV['CRYPTO_SUPER_ADMIN_PASSWORD'].env_presence)&.result || '00000000'
  admins.each do |admin|
    member = Member.find_or_initialize_by(email: admin)
    next unless member.new_record?
    member.assign_attributes(password: password, from_application_id: app.id, is_registered: true, confirmed_at: Time.zone.now)
    member.save
  end
  puts "[SEED] Created #{admins.count} super admins safely: #{admins.join(', ')}"
else
  puts "[SEED] No super admin found."
end
