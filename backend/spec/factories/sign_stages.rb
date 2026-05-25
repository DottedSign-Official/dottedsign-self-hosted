FactoryBot.define do
  factory :sign_stage do
    transient do
      base_stage_id { nil }
    end

    trait :with_member_a do
      before(:create) do |stage|
        member = create(:member_a)
        stage.actor_id = member.id
        stage.email = member.email
        stage.group_id = member.group_id
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
        stage.email = member.email
        stage.group_id = member.group_id
        stage.custom_message_setting = {
          processing_viewable: false,
          completed_viewable: true
        }
      end
    end

    trait :with_member_me do
      before(:create) do |stage|
        member = create(:member_me)
        stage.actor_id = member.id
        stage.email = member.email
        stage.group_id = member.group_id
        stage.custom_message_setting = {
          processing_viewable: true,
          completed_viewable: false
        }
      end
    end

    trait :with_not_register_member do
      before(:create) do |stage|
        member = create(:not_register_member)
        stage.actor_id = member.id
        stage.email = member.email
        stage.custom_message_setting = {
          processing_viewable: true,
          completed_viewable: true
        }
      end
    end

    trait :with_form_signer do
      action { 'form_sign' }

      before(:create) do |stage|
        member = create(:form_signer)
        stage.actor_id = member.id
        stage.email = member.email
        stage.actor_name = member.name
        stage.custom_message_setting = {
          processing_viewable: true,
          completed_viewable: true
        }
        stage.actor_info = {
          'role' => 'Form Signer',
          'name' => 'Ada',
          'email' => 'ada@test.com'
        }
      end
    end

    trait :status_processing do
      status { SignStage.statuses['processing'] }
      after(:create) do |stage|
        create(:sign_event, action_name: 'viewed', action_member: stage.actor, sign_task: stage.sign_task, stage: stage, owner: stage.sign_task.owner)
      end
    end

    # TODO: fix cert signed with review
    trait :status_signed do
      status { SignStage.statuses['signed'] }
      after(:create) do |stage|
        create(:sign_event, action_name: 'viewed', action_member: stage.actor, sign_task: stage.sign_task, stage: stage, owner: stage.sign_task.owner)
        create(:sign_event, action_name: 'verified', action_member: stage.actor, sign_task: stage.sign_task, stage: stage, owner: stage.sign_task.owner) if stage.verify_methods.present?
        sign_event = create(:sign_event, action_name: 'signed', action_member: stage.actor, sign_task: stage.sign_task, stage: stage, owner: stage.sign_task.owner)
        stage.attachment_setting.each do |setting|
          create(:service_file, storable: stage, label: setting['attachment_id'], uploaded_at: Time.zone.now)
        end
        create(:sign_log, source: stage.sign_task, stage: stage, sign_event: sign_event, changed: true)
      end
    end

    trait :status_modifying do
      status { SignStage.statuses['modifying'] }
      after(:create) do |stage|
        create(:sign_event, action_name: 'viewed', action_member: stage.actor, sign_task: stage.sign_task, stage: stage, owner: stage.sign_task.owner)
        create(:sign_event, action_name: 'verified', action_member: stage.actor, sign_task: stage.sign_task, stage: stage, owner: stage.sign_task.owner) if stage.verify_methods.present?
        sign_event = create(:sign_event, action_name: 'signed', action_member: stage.actor, sign_task: stage.sign_task, stage: stage, owner: stage.sign_task.owner)
        stage.attachment_setting.each do |setting|
          create(:service_file, storable: stage, label: setting['attachment_id'], uploaded_at: Time.zone.now)
        end
        create(:sign_log, source: stage.sign_task, stage: stage, sign_event: sign_event, changed: true)
      end
    end

    trait :status_reviewed do
      status { SignStage.statuses['reviewed'] }
      after(:create) do |stage|
        create(:sign_event, action_name: 'viewed', action_member: stage.actor, sign_task: stage.sign_task, stage: stage, owner: stage.sign_task.owner)
        create(:sign_event, action_name: 'verified', action_member: stage.actor, sign_task: stage.sign_task, stage: stage, owner: stage.sign_task.owner) if stage.verify_methods.present?
        sign_event = create(:sign_event, action_name: 'signed', action_member: stage.actor, sign_task: stage.sign_task, stage: stage, owner: stage.sign_task.owner)
        stage.attachment_setting.each do |setting|
          create(:service_file, storable: stage, label: setting['attachment_id'], uploaded_at: Time.zone.now)
        end
        create(:sign_log, source: stage.sign_task, stage: stage, sign_event: sign_event, changed: true)
      end
    end

    trait :status_rejected do
      status { SignStage.statuses['initial'] }
      after(:create) do |stage|
        create(:sign_event, action_name: 'viewed', action_member: stage.actor, sign_task: stage.sign_task, stage: stage, owner: stage.sign_task.owner)
        sign_event = create(:sign_event, action_name: 'review_rejected', action_member: stage.actor, sign_task: stage.sign_task, stage: stage, owner: stage.sign_task.owner)
        create(:review_log, source: stage.sign_task, stage: stage, sign_event: sign_event, pass: false)
      end
    end

    trait :status_done do
      status { SignStage.statuses['done'] }
      after(:create) do |stage|
        create(:sign_event, action_name: 'viewed', action_member: stage.actor, sign_task: stage.sign_task, stage: stage, owner: stage.sign_task.owner)
        create(:sign_event, action_name: 'verified', action_member: stage.actor, sign_task: stage.sign_task, stage: stage, owner: stage.sign_task.owner) if stage.verify_methods.present?
        case stage.action
        when 'sign', 'form_sign'
          sign_event = create(:sign_event, action_name: 'signed', action_member: stage.actor, sign_task: stage.sign_task, stage: stage, owner: stage.sign_task.owner, event_target: 'SignStage')
          stage.attachment_setting.each do |setting|
            create(:service_file, storable: stage, label: setting['attachment_id'], uploaded_at: Time.zone.now)
          end
          create(:sign_log, source: stage.sign_task, stage: stage, sign_event: sign_event, changed: true)
        when 'review'
          sign_event = create(:sign_event, action_name: 'review_passed', action_member: stage.actor, sign_task: stage.sign_task, stage: stage, owner: stage.sign_task.owner)
          create(:review_log, source: stage.sign_task, stage: stage, sign_event: sign_event, pass: true)
        end
      end
    end

    trait :status_declined do
      status { SignStage.statuses['declined'] }
      after(:create) do |stage|
        create(:sign_event, action_name: 'viewed', action_member: stage.actor, sign_task: stage.sign_task, owner: stage.sign_task.owner)
        create(:sign_event, action_name: 'declined', action_member: stage.actor, sign_task: stage.sign_task, owner: stage.sign_task.owner)
      end
    end

    trait :status_processing_file_failed do
      status { SignStage.statuses['processing_file_failed'] }
      after(:create) do |stage|
        create(:sign_event, action_name: 'ca_failed', action_member: stage.actor, sign_task: stage.sign_task, owner: stage.sign_task.owner)
      end
    end

    trait :with_fields do
      after(:create) do |stage|
        FactoryBot.create(:field_setting, :signature, source: stage.sign_task, stage: stage)
        FactoryBot.create(:field_setting, :text_field, source: stage.sign_task, stage: stage)
        FactoryBot.create(:field_setting, :link, source: stage.sign_task, stage: stage)
        FactoryBot.create(:field_setting, :image, source: stage.sign_task, stage: stage)
        stage.update(pdf_object_info: stage.field_settings.pluck(:field_object_id))
      end
    end

    trait :with_field_setting_groups do
      after(:create) do |stage|
        checkbox_group = create(:checkbox_group, source: stage.sign_task, stage: stage)
        radio_group = create(:radio_group, source: stage.sign_task, stage: stage)
        2.times do
          FactoryBot.create(:field_setting, :checkbox, source: stage.sign_task, stage: stage, field_setting_group: checkbox_group)
          FactoryBot.create(:field_setting, :radio, source: stage.sign_task, stage: stage, field_setting_group: radio_group)
        end
        stage.update(pdf_object_info: stage.field_settings.pluck(:field_object_id))
      end
    end

    trait :with_field_and_photo_signature do
      after(:create) do |stage|
        if stage.filled?
          signature = FactoryBot.create(:signature, member: stage.actor, category: 'signature_with_photo')
          FactoryBot.create(:field_setting, :signature_with_photo, source: stage.sign_task, stage: stage, field_value: signature.id)
        else
          FactoryBot.create(:field_setting, :signature_with_photo, source: stage.sign_task, stage: stage)
        end
        stage.update(pdf_object_info: stage.field_settings.pluck(:field_object_id))
      end
    end

    trait :with_verify_methods do
      after(:create) do |stage|
        create(:verify_method, stage: stage)
      end
    end

    factory :processing_sign_stage, traits: [:status_processing]
    factory :done_sign_stage, traits: [:status_done]
    factory :decline_sign_stage, traits: [:status_declined]

    factory :a_sign_stage, traits: [:with_member_a]
    factory :b_sign_stage, traits: [:with_member_b]
    factory :me_sign_stage, traits: [:with_member_me]
    
    factory :a_processing_sign_stage, traits: [:with_member_a, :status_processing]
    factory :b_processing_sign_stage, traits: [:with_member_b, :status_processing]
    factory :me_processing_sign_stage, traits: [:with_member_me, :status_processing]
    factory :me_processing_with_fields_stage, traits: [:with_member_me, :status_processing, :with_fields]
    factory :me_processing_with_field_setting_group, traits: [:with_member_me, :status_processing, :with_field_setting_groups]
    factory :me_processing_with_photo_signature, traits: [:with_member_me, :status_processing, :with_field_and_photo_signature]
    factory :form_processing_sign_stage, traits: [:with_form_signer, :status_processing]

    factory :a_signed_sign_stage, traits: [:with_member_a, :status_signed]
    factory :b_signed_sign_stage, traits: [:with_member_b, :status_signed]
    factory :me_signed_sign_stage, traits: [:with_member_me, :status_signed]

    factory :a_modifying_sign_stage, traits: [:with_member_a, :status_modifying]
    factory :b_modifying_sign_stage, traits: [:with_member_b, :status_modifying]
    factory :me_modifying_sign_stage, traits: [:with_member_me, :status_modifying]

    factory :a_reviewed_sign_stage, traits: [:with_member_a, :status_reviewed]
    factory :b_reviewed_sign_stage, traits: [:with_member_b, :status_reviewed]
    factory :me_reviewed_sign_stage, traits: [:with_member_me, :status_reviewed]

    factory :a_rejected_sign_stage, traits: [:with_member_a, :status_rejected]
    factory :b_rejected_sign_stage, traits: [:with_member_b, :status_rejected]
    factory :me_rejected_sign_stage, traits: [:with_member_me, :status_rejected]

    factory :a_done_sign_stage, traits: [:with_member_a, :status_done]
    factory :a_done_sign_stage_with_photo_signature, traits: [:with_member_a, :status_done, :with_field_and_photo_signature]
    factory :b_done_sign_stage, traits: [:with_member_b, :status_done]
    factory :me_done_sign_stage, traits: [:with_member_me, :status_done]
    factory :form_done_sign_stage, traits: [:with_form_signer, :status_done]

    factory :a_declined_sign_stage, traits: [:with_member_a, :status_declined]

    factory :a_file_failed_sign_stage, traits: [:with_member_a, :status_processing_file_failed]
    factory :b_file_failed_sign_stage, traits: [:with_member_b, :status_processing_file_failed]
    factory :me_file_failed_sign_stage, traits: [:with_member_me, :status_processing_file_failed]

    factory :not_kdan_processing_sign_stage, traits: [:with_not_register_member, :status_processing]
    factory :not_kdan_done_sign_stage, traits: [:with_not_register_member, :status_done]
    factory :not_kdan_modifying_sign_stage, traits: [:with_not_register_member, :status_modifying]
    factory :not_kdan_reviewed_sign_stage, traits: [:with_not_register_member, :status_reviewed]

    after(:create) do |stage, evaluator|
      if stage.action == 'sign'
        field_settings = [
          create(:field_setting, :signature, source: stage.sign_task, stage: stage),
          create(:field_setting, :text_field, source: stage.sign_task, stage: stage),
          create(:field_setting, :systemtime_year_roc, source: stage.sign_task, stage: stage),
          create(:field_setting, :systemtime_month, source: stage.sign_task, stage: stage),
          create(:field_setting, :systemtime_day, source: stage.sign_task, stage: stage)
        ]
        create(:xfdf_document, source: stage.sign_task, stage: stage)
        attachment_setting = {
          attachment_id: "attachment_#{stage.id}_1",
          file_name: "attachment_#{stage.id}_1.pdf",
          force: false,
          viewable_in_processing: true
        }
        stage.update(group_id: stage.actor.group_id, pdf_object_info: field_settings.pluck(:field_object_id), attachment_setting: [attachment_setting])
        create(:stage_setting, stage: stage, forward_enable: true, decline_enable: true)
      elsif stage.action == 'review'
        stage.update(actor_info: { base_stage_id: evaluator.base_stage_id })
      end
    end
  end
end
