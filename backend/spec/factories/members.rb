FactoryBot.define do
  factory :member do
    password { 'testtest' }
    is_registered { true }
    confirmed_at { Time.zone.now }
    preferences {{
      "date_format": "yyyy/mm/dd",
      "forget_remind": true,
      "expire_remind":true,
      "remind_days_before_expire": 1,
      "otp_via_email": false,
      "otp_via_phone": false,
      "receiver_lang": Settings.default.preference.receiver_lang,
      "force_receiver_otp":true
    }}
    
    factory :member_default_group_admin do
      name { 'Admin of default group' }
      email { 'admin@defalt.com' }
    end

    factory :member_me do
      name { 'Me' }
      email { 'me@gmail.com' }
    end

    factory :member_a do
      name { 'Ada' }
      email { 'ada@gmail.com' }
    end

    factory :member_b do
      name { 'Bella' }
      email { 'bella@gmail.com' }
    end

    factory :member_otp do
      name { 'OTP' }
      email { 'otp@gmail.com' }
      preferences {{
        otp_via_email: true,
        receive_otp_always: true
      }}
    end

    factory :not_register_member do
      name { 'Signer Not Register' }
      email { 'not-register@gmail.com' }
      is_registered { false }
      confirmed_at { nil }
    end

    factory :not_register_member_need_otp do
      name { 'Signer Not Register Need OTP' }
      email { 'not-register-need-otp@gmail.com' }
      is_registered { false }
      confirmed_at { nil }
      preferences {{
        otp_via_email: true,
        receive_otp_always: true
      }}
    end

    factory :not_confirmed_member do
      name { 'Signer Not Confirm' }
      email { 'not-confirm@gmail.com' }
      confirmed_at { nil }
    end

    factory :group_member do
      name { 'Group Member' }
      email { 'group@gmail.com' }

      after(:create) do |member|
        member.generate_group('Test Group')
      end
    end

    factory :form_signer do
      name { 'Form Signer' }
      email { 'form-signer@kdanmobile.com' }
    end

    initialize_with { Member.find_or_initialize_by(email: email) }
    after(:create) do |member|
      create(:signature, member: member)
      create(:profile, member: member, email: member.email, full_name: member.name, first_name: member.name)
    end
  end
end
