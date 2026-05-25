FactoryBot.define do
  factory :field_setting do
    sequence(:field_object_id) { |n| "object_id_#{n}" }
    coord { '111,222,333,444' }
    page { 0 }

    trait :signature do
      field_type { 'signature' }
      options { { force: false } }
    end

    trait :signature_with_photo do
      field_type { 'signature' }
      options { { force: false, photo: true, signature_type: 'Signature' } }
    end

    trait :text_field do
      field_type { 'textfield' }
      options { { force: false } }
    end

    trait :checkbox do
      field_type { 'checkbox' }
      field_value { true }
      options { { force: true, read_only: false, default: false } }
    end

    trait :radio do
      field_type { 'radio' }
      field_value { true }
      options { { force: true, read_only: false, default: false } }
    end

    trait :link do
      field_type { 'link' }
      field_value { 'https://localhost' }
      options { { force: true, read_only: false, default: '' } }
    end

    trait :image do
      field_type { 'image' }
      options { { force: true, read_only: false } }
      before(:create) do |field_setting|
        image = FactoryBot.create(:image)
        field_setting.field_value = image.id
      end
    end

    trait :systemtime_year_roc do
      field_type { 'systemtime' }
      options { { force: false, format: 'year_roc' } }
    end

    trait :systemtime_year_ad do
      field_type { 'systemtime' }
      options { { force: false, format: 'year_ad' } }
    end

    trait :systemtime_month do
      field_type { 'systemtime' }
      options { { force: false, format: 'month' } }
    end

    trait :systemtime_day do
      field_type { 'systemtime' }
      options { { force: false, format: 'day' } }
    end
  end
end
