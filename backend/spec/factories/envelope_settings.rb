FactoryBot.define do
  factory :envelope_setting do
    forget_remind { true }
    expire_remind_at { 10.minutes.after }
    message { 'message' }
    need_otp_verify { true }
    receiver_lang { Settings.default.preference.receiver_lang }

    trait :not_expire_soon do deadline { 1.month.after } end
    trait :expire_soon do deadline { 3.days.after } end
    trait :expired do deadline { 1.day.before } end
    trait :has_processing_message do message { 'processing message' } end
    trait :has_completed_message do completed_message { 'completed message' } end

    factory :not_expire_soon_envelope_setting, traits: [:not_expire_soon, :has_processing_message, :has_completed_message]
    factory :expire_soon_envelope_setting, traits: [:expire_soon]
    factory :expired_envelope_setting, traits: [:expired]
  end
end
