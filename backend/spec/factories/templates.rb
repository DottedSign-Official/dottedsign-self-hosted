FactoryBot.define do
  factory :template do
    transient do
      dummy_stage_count { 1 }
      with_review_stage { false }
    end

    owner { create(:member_me) }
    status { 'active' }
    sequence :file_name do |n|
      "Template #{n}"
    end

    sequence :code do |n|
      "code_#{n}"
    end

    factory :need_verify_template do
      after(:create) do |template|
        create(:verify_method, stage: template.dummy_stages.action_sign.last)
      end
    end    

    after(:create) do |template, evaluator|
      create_list(:dummy_stage, evaluator.dummy_stage_count, :with_xfdf_and_fields, :with_field_setting_groups, source: template)
      create(:dummy_stage, action: 'review', source: template, base_stage_id: evaluator.dummy_stage_count) if evaluator.with_review_stage
      template.stages.each_with_index do |stage, index|
        stage.update(sequence: index + 1)
      end
      create(:uploaded_file, storable: template, label: 'original')
      create(:uploaded_file, storable: template, label: 'full')
    end
  end
end
