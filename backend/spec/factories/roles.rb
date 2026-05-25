FactoryBot.define do
  factory :role do
    name { 'Test Role' }

    before(:create) do |role|
      role.priority = role.group.roles.count + 1
    end
  end
end
