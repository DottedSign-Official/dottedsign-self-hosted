FactoryBot.define do
  factory :bulk_mission do
    count { 2 }
    template { create(:template, dummy_stage_count: 3) }

    trait :own_by_me do owner { create(:member_me) } end
    trait :processing_status do status { BulkMission.statuses['processing'] } end
    trait :completed_status do status { BulkMission.statuses['completed'] } end

    trait :create_processing_tasks do
      after(:create) do |mission|
        create_list(:waiting_for_me2, mission.count, bulk_mission: mission)
      end
    end
    
    trait :create_completed_tasks do
      after(:create) do |mission|
        create_list(:completed_task3, mission.count, bulk_mission: mission)
      end
    end

    factory :processing_mission, traits: [:own_by_me, :processing_status, :create_processing_tasks]
    factory :completed_mission, traits: [:own_by_me, :completed_status, :create_completed_tasks]
    
    after(:create) do |mission|
      next unless mission.completed?
      create(:uploaded_file, storable: mission, label: 'compress')
    end
  end
end
