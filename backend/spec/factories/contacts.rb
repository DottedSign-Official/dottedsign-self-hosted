FactoryBot.define do
  factory :contact do
    member
    sequence(:email){|n| "contact#{n}@test.com"}
  end
end
