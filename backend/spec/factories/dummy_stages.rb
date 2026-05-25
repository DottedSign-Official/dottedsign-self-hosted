FactoryBot.define do
  factory :dummy_stage do
    transient do
      base_stage_id { nil }
    end

    sequence :sequence
    sequence :actor_info do |n|
      { role: "role#{n}" }
    end

    trait :with_member_me do
      before(:create) do |stage|
        member = create(:member_me)
        stage.actor_id = member.id
        stage.actor_info = { email: member.email, role: 'Me' }
        # stage.group_id = member.group_id
        stage.custom_message_setting = {
          processing_viewable: true,
          completed_viewable: false
        }
      end
    end

    trait :with_member_a do
      before(:create) do |stage|
        member = create(:member_a)
        stage.actor_id = member.id
        stage.actor_info = { email: member.email, role: 'role_a' }
        stage.custom_message_setting = {
          processing_viewable: true,
          completed_viewable: true
        }
      end
    end

    trait :with_member_b do
      before(:create) do |stage|
        member = create(:member_b)
        stage.actor_id = member.id
        stage.actor_info = { email: member.email, role: 'role_b' }
        stage.custom_message_setting = {
          processing_viewable: false,
          completed_viewable: true
        }
      end
    end

    trait :with_not_register_member do
      before(:create) do |stage|
        member = create(:not_register_member)
        stage.actor_id = member.id
        stage.actor_info = { email: member.email, role: 'not_register_member' }
        stage.custom_message_setting = {
          processing_viewable: true,
          completed_viewable: true
        }
      end
    end

    trait :status_processing do
      status { DummyStage.statuses['processing'] }
      after(:create) do |stage|
        create(:sign_event, action_name: 'viewed', action_member: stage.actor, envelope: stage.source, owner: stage.source.owner)
      end
    end

    trait :status_declined do
      status { DummyStage.statuses['declined'] }
      after(:create) do |stage|
        create(:sign_event, action_name: 'declined', action_member: stage.actor, envelope: stage.source, owner: stage.source.owner)
      end
    end

    trait :status_done do
      status { DummyStage.statuses['done'] }
      after(:create) do |stage|
        create(:sign_event, action_name: 'viewed', action_member: stage.actor, envelope: stage.source, owner: stage.source.owner)
        create(:sign_event, action_name: 'signed', action_member: stage.actor, envelope: stage.source, owner: stage.source.owner)
      end
    end

    trait :with_xfdf_and_fields do
      after(:create) do |stage|
        create(:xfdf_document, source: stage.source, stage: stage)
        create(:field_setting, :signature, source: stage.source, stage: stage)
        create(:field_setting, :text_field, source: stage.source, stage: stage)
        create(:field_setting, :link, source: stage.source, stage: stage)
        create(:field_setting, :image, source: stage.source, stage: stage)
      end
    end

    trait :with_field_setting_groups do
      after(:create) do |stage|
        checkbox_group = create(:checkbox_group, source: stage.source, stage: stage)
        radio_group = create(:radio_group, source: stage.source, stage: stage)
        2.times do
          FactoryBot.create(:field_setting, :checkbox, source: stage.source, stage: stage, field_setting_group: checkbox_group)
          FactoryBot.create(:field_setting, :radio, source: stage.source, stage: stage, field_setting_group: radio_group)
        end
        stage.update(pdf_object_info: stage.field_settings.pluck(:field_object_id))
      end
    end

    factory :processing_dummy_stage, traits: [:status_processing]

    factory :a_dummy_stage, traits: [:with_member_a]
    factory :b_dummy_stage, traits: [:with_member_b]

    factory :a_processing_dummy_stage, traits: [:with_member_a, :status_processing]
    factory :b_processing_dummy_stage, traits: [:with_member_b, :status_processing]
    factory :me_processing_dummy_stage, traits: [:with_member_me, :status_processing]
    factory :a_declined_dummy_stage, traits: [:with_member_a, :status_declined]
    factory :me_done_dummy_stage, traits: [:with_member_me, :status_done]
    factory :a_done_dummy_stage, traits: [:with_member_a, :status_done]
    factory :b_done_dummy_stage, traits: [:with_member_b, :status_done]

    factory :not_kdan_dummy_stage, traits: [:with_not_register_member, :status_processing]

    after(:create) do |stage, evaluator|
      create(:stage_setting, stage: stage, forward_enable: true, decline_enable: true)
      next unless stage.action == 'review'
      stage.update(actor_info: { base_stage_id: evaluator.base_stage_id })
    end
  end
end
