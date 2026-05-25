FactoryBot.define do
  factory :service_file do

    factory :uploaded_file do
      uploaded_at {Time.zone.now}
    end

  end
end
