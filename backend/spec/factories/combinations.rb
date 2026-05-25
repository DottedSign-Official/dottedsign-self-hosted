FactoryBot.define do
  factory :combination do
    name { "Test Combination" }

    after(:create) do |combination, evaluator|
      create(:dummy_stage, sequence: 1, source: combination)
      combination.update(quantity: combination.dummy_stages.count)
    end
  end
end
