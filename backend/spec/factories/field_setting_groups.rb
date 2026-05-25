FactoryBot.define do
  factory :field_setting_group do
    sequence(:field_group_object_id) { |n| "field_group_#{n}" }
    options { { force: false, read_only: false } }

    trait :checkbox do
      field_group_type { 'checkbox' }
    end

    trait :radio do
      field_group_type { 'radio' }
    end

    factory :checkbox_group, traits: [:checkbox]
    factory :radio_group, traits: [:radio]
  end
end
