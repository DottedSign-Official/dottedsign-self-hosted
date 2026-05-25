FactoryBot.define do
  factory :signature do
    member
    category {'signature'}
    file_type {'png'}

    trait :initial do
      category {'initial'}
    end

    trait :stamp do
      category {'stamp'}
    end

    trait :signature_with_photo do
      category {'signature_with_photo'}
    end
  
    after(:create) do |signature|
      FactoryBot.create(:uploaded_file, storable: signature, label: 'signature_raw')
      next unless signature.category == 'signature_with_photo'
      signature.update(other_info: signature.other_info.merge('photo' => true))
      FactoryBot.create(:uploaded_file, storable: signature, label: 'signature_photo')
    end
  end
end
