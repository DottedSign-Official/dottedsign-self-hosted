FactoryBot.define do
  factory :profile do
    language { Settings.default.profile.language }
    telephone { '+886-000-000-000' }
    nationality { 'Taiwan' }
    address { 'kdanmobile' }
    organization { 'kdanmobile' }
  end
end
