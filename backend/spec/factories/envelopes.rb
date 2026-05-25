FactoryBot.define do
  factory :envelope do
    envelope_name { 'Untitled' }
    group_id { owner.group_id }

    trait :draft_status do status { Envelope.statuses['draft'] } end
    trait :waiting_status do status { Envelope.statuses['waiting'] } end
    trait :completed_status do status { Envelope.statuses['completed'] } end
    trait :expired_status do status { Envelope.statuses['expired'] } end
    trait :declined_status do status { Envelope.statuses['declined'] } end

    trait :own_by_me do owner { create(:member_me) } end
    trait :own_by_a do owner { create(:member_a) } end
    trait :own_by_b do owner { create(:member_b) } end

    trait :create_draft_tasks do
      after(:create) do |envelope|
        create_list(:draft_task, 2, envelope: envelope)
      end
    end

    trait :create_waiting_tasks do
      after(:create) do |envelope|
        create_list(:waiting_for_me1, 2, envelope: envelope)
      end
    end

    trait :create_waiting_tasks2 do
      after(:create) do |envelope|
        create_list(:waiting_for_me2, 2, envelope: envelope)
      end
    end

    trait :create_waiting_for_others_tasks do
      after(:create) do |envelope|
        create_list(:waiting_for_others1, 2, envelope: envelope)
      end
    end

    trait :create_waiting_for_others_tasks4 do
      after(:create) do |envelope|
        create_list(:waiting_for_others4, 2, envelope: envelope)
      end
    end

    trait :create_completed_tasks do
      after(:create) do |envelope|
        create_list(:completed_task1, 2, envelope: envelope)
      end
    end

    trait :create_expired_tasks do
      after(:create) do |envelope|
        create_list(:expired_task1, 2, envelope: envelope)
      end
    end

    trait :create_declined_tasks do
      after(:create) do |envelope|
        create_list(:declined_task1, 2, envelope: envelope)
      end
    end

    trait :create_not_related_tasks do
      after(:create) do |envelope|
        create_list(:not_related, 2, envelope: envelope)
      end
    end

    trait :create_owner_need_otp_tasks do
      after(:create) do |envelope|
        create_list(:owner_need_otp_task, 2, envelope: envelope)
      end
    end

    trait :create_owner_need_read_otp_tasks do
      after(:create) do |envelope|
        create_list(:owner_need_read_otp_task, 2, envelope: envelope)
      end
    end

    trait :create_signer_need_otp_tasks do
      after(:create) do |envelope|
        create_list(:signer_need_otp_task, 2, verify_type: 'cht_personal', envelope: envelope)
      end
    end

    trait :create_quick_signer_need_read_otp_tasks do
      after(:create) do |envelope|
        create_list(:quick_signer_need_otp_task, 2, envelope: envelope)
      end
    end

    trait :create_quick_sign_tasks do
      after(:create) do |envelope|
        create_list(:quick_sign_task, 2, envelope: envelope)
      end
    end

    trait :create_me_sender_waiting_tasks do
      after(:create) do |envelope|
        create_list(:me_sender_waiting_task, 2, envelope: envelope)
      end
    end

    trait :create_me_signer_waiting_tasks do
      after(:create) do |envelope|
        create_list(:me_signer_waiting_task, 2, envelope: envelope)
      end
    end

    trait :create_a_sender_waiting_tasks do
      after(:create) do |envelope|
        create_list(:a_sender_waiting_task, 2, envelope: envelope)
      end
    end
    
    trait :create_a_signer_waiting_tasks do
      after(:create) do |envelope|
        create_list(:a_signer_waiting_task, 2, envelope: envelope)
      end
    end
    
    trait :create_me_sender_complete_tasks do
      after(:create) do |envelope|
        create_list(:me_sender_complete_task, 2, envelope: envelope)
      end
    end
    
    trait :create_me_signer_complete_tasks do
      after(:create) do |envelope|
        create_list(:me_signer_complete_task, 2, envelope: envelope)
      end
    end

    trait :create_a_sender_completed_tasks do
      after(:create) do |envelope|
        create_list(:a_sender_complete_task, 2, envelope: envelope)
      end
    end

    trait :create_a_signer_completed_tasks do
      after(:create) do |envelope|
        create_list(:a_signer_complete_task, 2, envelope: envelope)
      end
    end

    trait :create_draft_stages do
      after(:create) do |envelope|
        create(:a_dummy_stage, sequence: 1, source: envelope)
        create(:b_dummy_stage, sequence: 2, source: envelope)
        create(:dummy_stage, sequence: 3, source: envelope)
      end
    end

    trait :create_waiting_for_me_stages do
      after(:create) do |envelope|
        create(:a_done_dummy_stage, sequence: 1, source: envelope)
        create(:me_processing_dummy_stage, sequence: 2, source: envelope)
        create(:b_dummy_stage, sequence: 3, source: envelope)
      end
    end

    trait :create_waiting_for_me_stages2 do
      after(:create) do |envelope|
        create(:a_done_dummy_stage, sequence: 1, source: envelope)
        create(:b_done_dummy_stage, sequence: 2, source: envelope)
        create(:me_processing_dummy_stage, sequence: 3, source: envelope)
      end
    end

    trait :create_waiting_for_a_stage do
      after(:create) do |envelope|
        create(:a_processing_dummy_stage, sequence: 1, source: envelope)
      end
    end

    trait :create_waiting_for_b_stage do
      after(:create) do |envelope|
        create(:b_processing_dummy_stage, sequence: 1, source: envelope)
      end
    end

    trait :create_waiting_for_others_stages do
      after(:create) do |envelope|
        create(:a_done_dummy_stage, sequence: 1, source: envelope)
        create(:b_done_dummy_stage, sequence: 2, source: envelope)
        actor_info = { email: create(:not_register_member_need_otp).email, role: 'quick_signer' }
        create(:processing_dummy_stage, actor_info: actor_info, sequence: 3, source: envelope)
      end
    end

    trait :create_waiting_for_others_stages4 do
      after(:create) do |envelope|
        create(:a_processing_dummy_stage, sequence: 1, source: envelope)
        create(:b_processing_dummy_stage, sequence: 2, source: envelope)
      end
    end

    trait :create_me_processing_stages do
      after(:create) do |envelope|
        create(:me_processing_dummy_stage, sequence: 1, source: envelope)
      end
    end

    trait :create_completed_stages do
      after(:create) do |envelope|
        create(:a_done_dummy_stage, sequence: 1, source: envelope)
        create(:b_done_dummy_stage, sequence: 2, source: envelope)
      end
    end

    trait :create_me_complete_stage do
      after(:create) do |envelope|
        create(:me_done_dummy_stage, sequence: 1, source: envelope)
      end
    end

    trait :create_a_complete_stage do
      after(:create) do |envelope|
        create(:a_done_dummy_stage, sequence: 1, source: envelope)
      end
    end

    trait :create_b_complete_stage do
      after(:create) do |envelope|
        create(:b_done_dummy_stage, sequence: 1, source: envelope)
      end
    end

    trait :create_not_related_stages do
      after(:create) do |envelope|
        create(:b_done_dummy_stage, sequence: 2, source: envelope)
      end
    end

    trait :create_signer_need_otp_stages do
      after(:create) do |envelope|
        actor_info = { email: create(:member_otp).email, role: 'quick_signer' }
        create(:processing_dummy_stage, actor_info: actor_info, sequence: 1, source: envelope)
      end
    end

    trait :create_quick_signer_need_otp_stages do
      after(:create) do |envelope|
        actor_info = { email: create(:not_register_member_need_otp).email, role: 'quick_signer' }
        create(:processing_dummy_stage, actor_info: actor_info, sequence: 1, source: envelope)
      end
    end

    trait :create_not_kdan_stages do
      after(:create) do |envelope|
        create(:not_kdan_dummy_stage, sequence: 1, source: envelope)
      end
    end

    trait :create_a_declined_stage do
      after(:create) do |envelope|
        create(:a_declined_dummy_stage, sequence: 1, source: envelope)
      end
    end

    trait :create_not_expire_soon_setting do
      after(:create) do |envelope|
        create(:not_expire_soon_envelope_setting, envelope: envelope)
      end
    end

    trait :create_expire_soon_setting do
      after(:create) do |envelope|
        create(:expire_soon_envelope_setting, envelope: envelope)
      end
    end

    trait :create_expired_setting do
      after(:create) do |envelope|
        create(:expired_envelope_setting, envelope: envelope)
      end
    end

    factory :draft_envelope, traits: [:draft_status, :own_by_me, :create_draft_tasks, :create_draft_stages, :create_not_expire_soon_setting]
    factory :draft_envelope2, traits: [:draft_status, :own_by_a, :create_draft_tasks, :create_draft_stages, :create_not_expire_soon_setting]
    factory :waiting_for_me_envelope, traits: [:waiting_status, :own_by_me, :create_waiting_tasks, :create_waiting_for_me_stages, :create_expire_soon_setting]
    factory :waiting_for_me_envelope2, traits: [:waiting_status, :own_by_a, :create_waiting_tasks2, :create_waiting_for_me_stages2, :create_expire_soon_setting]
    factory :waiting_for_others_envelope, traits: [:waiting_status, :own_by_me, :create_waiting_for_others_tasks, :create_waiting_for_others_stages, :create_expire_soon_setting]
    factory :waiting_for_others_envelope4, traits: [:waiting_status, :own_by_me, :create_waiting_for_others_tasks4, :create_waiting_for_others_stages4, :create_expire_soon_setting]
    factory :completed_envelope, traits: [:completed_status, :own_by_me, :create_completed_tasks, :create_completed_stages, :create_expire_soon_setting]
    factory :expired_envelope, traits: [:expired_status, :own_by_me, :create_expired_tasks, :create_waiting_for_me_stages, :create_expired_setting]
    factory :declined_envelope, traits: [:declined_status, :own_by_me, :create_declined_tasks, :create_a_declined_stage, :create_not_expire_soon_setting]
    factory :not_related_envelope, traits: [:completed_status, :own_by_a, :create_not_related_tasks, :create_not_related_stages, :create_not_expire_soon_setting]
    factory :owner_need_otp_envelope, traits: [:waiting_status, :own_by_a, :create_owner_need_otp_tasks, :create_me_processing_stages, :create_not_expire_soon_setting]
    factory :owner_need_read_otp_envelope, traits: [:waiting_status, :own_by_a, :create_owner_need_read_otp_tasks, :create_me_processing_stages, :create_not_expire_soon_setting]
    factory :signer_need_otp_envelope, traits: [:waiting_status, :own_by_me, :create_signer_need_otp_tasks, :create_signer_need_otp_stages, :create_not_expire_soon_setting]
    factory :quick_signer_need_otp_envelope, traits: [:waiting_status, :own_by_a, :create_quick_signer_need_read_otp_tasks, :create_quick_signer_need_otp_stages, :create_not_expire_soon_setting]
    factory :quick_sign_envelope, traits: [:waiting_status, :own_by_me, :create_quick_sign_tasks, :create_not_kdan_stages, :create_not_expire_soon_setting]

    factory :me_sender_waiting_envelope, traits: [:waiting_status, :own_by_me, :create_me_sender_waiting_tasks, :create_waiting_for_b_stage, :create_not_expire_soon_setting]
    factory :me_signer_waiting_envelope, traits: [:waiting_status, :own_by_b, :create_me_signer_waiting_tasks, :create_waiting_for_me_stages, :create_not_expire_soon_setting]
    factory :a_sender_waiting_envelope, traits: [:waiting_status, :own_by_a, :create_a_sender_waiting_tasks, :create_waiting_for_b_stage, :create_not_expire_soon_setting]
    factory :a_signer_waiting_envelope, traits: [:waiting_status, :own_by_b, :create_a_signer_waiting_tasks, :create_waiting_for_a_stage, :create_not_expire_soon_setting]
    factory :me_sender_completed_envelope, traits: [:completed_status, :own_by_me, :create_me_sender_complete_tasks, :create_b_complete_stage, :create_not_expire_soon_setting]
    factory :me_signer_completed_envelope, traits: [:completed_status, :own_by_b, :create_me_signer_complete_tasks, :create_me_complete_stage, :create_not_expire_soon_setting]
    factory :a_sender_completed_envelope, traits: [:completed_status, :own_by_a, :create_a_sender_completed_tasks, :create_b_complete_stage, :create_not_expire_soon_setting]
    factory :a_signer_completed_envelope, traits: [:completed_status, :own_by_b, :create_a_signer_completed_tasks, :create_a_complete_stage, :create_not_expire_soon_setting]

    after(:create) do |envelope|
      create(:sign_event, action_name: 'created', envelope: envelope, owner: envelope.owner, action_member: envelope.owner)
      create(:sign_event, action_name: 'sent', envelope: envelope, owner: envelope.owner, action_member: envelope.owner) unless envelope.draft?
      create(:uploaded_file, storable: envelope, label: 'original')
      next unless envelope.completed?
      create(:uploaded_file, storable: envelope, label: 'completed')
      mock_complete_worker(envelope)
      envelope.update(completed_at: Time.zone.now, group_id: envelope.owner.group_id)
    end
  end
end
