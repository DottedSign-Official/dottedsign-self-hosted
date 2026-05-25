FactoryBot.define do
  trait :own_by_me do owner { create(:member_me) } end
  trait :own_by_a do owner { create(:member_a) } end
  trait :own_by_b do owner { create(:member_b) } end

  trait :draft_status do status { SignTask.statuses['draft'] } end
  trait :waiting_status do status { SignTask.statuses['waiting'] } end
  trait :completed_status do status { SignTask.statuses['completed'] } end
  trait :expired_status do status { SignTask.statuses['expired'] } end
  trait :deleted_status do status { SignTask.statuses['deleted'] } end
  trait :declined_status do status { SignTask.statuses['declined'] } end

  trait :my_file do file_name { 'my_draft.pdf' } end
  trait :a_file do file_name { 'a.pdf' } end
  trait :normal_file do file_name { 'normal.pdf' } end
  trait :amy_file do file_name { 'amys.pdf' } end

  trait :form_type do sign_type { SignTask.sign_types['form'] } end

  factory :sign_task do
    group_id { owner.group_id }

    trait :create_draft_stages do
      after(:create) do |task|
        create(:a_sign_stage, sequence: 1, sign_task: task)
        create(:b_sign_stage, sequence: 2, sign_task: task)
        create(:sign_stage, email: 'cindy@test.com', sequence: 3, sign_task: task)
      end
    end

    trait :create_reissue_for_me_stages1 do
      after(:create) do |task|
        create(:a_done_sign_stage, sequence: 1, sign_task: task)
        create(:me_file_failed_sign_stage, sequence: 2, sign_task: task)
        create(:b_sign_stage, sequence: 3, sign_task: task)
      end
    end

    trait :create_waiting_form_stages do
      after(:create) do |task|
        create(:form_processing_sign_stage, sequence: 1, sign_task: task)
        create(:me_sign_stage, sequence: 2, sign_task: task)
      end
    end

    trait :create_waiting_for_me_stage do
      after(:create) do |task|
        create(:me_processing_sign_stage, sequence: 1, sign_task: task)
      end
    end

    trait :create_waiting_for_a_stage do
      after(:create) do |task|
        create(:a_processing_sign_stage, sequence: 1, sign_task: task)
      end
    end

    trait :create_waiting_for_b_stage do
      after(:create) do |task|
        create(:b_processing_sign_stage, sequence: 1, sign_task: task)
      end
    end

    trait :create_waiting_for_me_stages1 do
      after(:create) do |task|
        create(:a_done_sign_stage, sequence: 1, sign_task: task)
        create(:me_processing_sign_stage, sequence: 2, sign_task: task)
        create(:b_sign_stage, sequence: 3, sign_task: task)
      end
    end

    trait :create_waiting_for_me_stages2 do
      after(:create) do |task|
        create(:a_done_sign_stage, sequence: 1, sign_task: task)
        create(:b_done_sign_stage, sequence: 2, sign_task: task)
        create(:me_processing_sign_stage, sequence: 3, sign_task: task)
      end
    end

    trait :create_waiting_for_me_stages3 do
      after(:create) do |task|
        stage1 = create(:me_processing_sign_stage, sequence: 1, sign_task: task)
        create(:a_sign_stage, sequence: 2, sign_task: task, action: 'review', base_stage_id: stage1.id)
        create(:b_sign_stage, sequence: 3, sign_task: task, action: 'review', base_stage_id: stage1.id)
        create(:a_sign_stage, sequence: 4, sign_task: task)
      end
    end

    trait :create_waiting_for_me_stages4 do
      after(:create) do |task|
        create(:a_done_sign_stage_with_photo_signature, sequence: 1, sign_task: task)
        create(:me_processing_with_photo_signature, sequence: 2, sign_task: task)
        create(:b_sign_stage, sequence: 3, sign_task: task)
      end
    end

    trait :create_waiting_for_me_form_stages do
      after(:create) do |task|
        create(:form_done_sign_stage, sequence: 1, sign_task: task)
        create(:me_processing_sign_stage, sequence: 2, sign_task: task)
      end
    end

    trait :create_waiting_for_other_stages1 do
      after(:create) do |task|
        create(:a_done_sign_stage, sequence: 1, sign_task: task)
        create(:b_done_sign_stage, sequence: 2, sign_task: task)
        create(:processing_sign_stage, email: 'cindy@test.com', sequence: 3, sign_task: task)
      end
    end

    trait :create_waiting_for_other_stages2 do
      after(:create) do |task|
        create(:a_done_sign_stage, sequence: 1, sign_task: task)
        create(:b_processing_sign_stage, sequence: 2, sign_task: task)
        create(:me_sign_stage, sequence: 3, sign_task: task)
      end
    end

    trait :create_waiting_for_other_stages3 do
      after(:create) do |task|
        create(:a_done_sign_stage, sequence: 1, sign_task: task)
        create(:me_done_sign_stage, sequence: 2, sign_task: task)
        create(:processing_sign_stage, email: 'cindy@test.com', sequence: 3, sign_task: task)
      end
    end

    trait :create_waiting_for_other_stages4 do
      after(:create) do |task|
        create(:a_processing_sign_stage, sequence: 1, sign_task: task)
        create(:b_processing_sign_stage, sequence: 2, sign_task: task)
      end
    end

    trait :create_waiting_for_me_review_stages1 do
      after(:create) do |task|
        stage1 = create(:a_signed_sign_stage, sequence: 1, sign_task: task)
        create(:me_processing_sign_stage, sequence: 2, sign_task: task, action: 'review', base_stage_id: stage1.id)
      end
    end

    trait :create_waiting_for_me_review_stages2 do
      after(:create) do |task|
        stage1 = create(:a_signed_sign_stage, sequence: 1, sign_task: task)
        stage2 = create(:me_processing_sign_stage, sequence: 2, sign_task: task, action: 'review', base_stage_id: stage1.id)
        reviewed_event = create(:sign_event, action_name: 'review_rejected', action_member: stage2.actor, sign_task: task, stage: stage2, owner: task.owner)
        modified_event = create(:sign_event, action_name: 'modified', action_member: stage1.actor, sign_task: task, stage: stage1, owner: task.owner)
        create(:review_log, source: task, stage: stage2, sign_event: reviewed_event, pass: false)
        create(:sign_log, source: task, stage: stage1, sign_event: modified_event)
      end
    end

    trait :create_waiting_for_me_modify_stages1 do
      after(:create) do |task|
        stage1 = create(:me_modifying_sign_stage, sequence: 1, sign_task: task)
        create(:a_rejected_sign_stage, sequence: 2, sign_task: task, action: 'review', base_stage_id: stage1.id)
      end
    end

    trait :create_waiting_for_me_confirm_stages1 do
      after(:create) do |task|
        stage1 = create(:me_reviewed_sign_stage, sequence: 1, sign_task: task)
        create(:a_done_sign_stage, sequence: 2, sign_task: task, action: 'review', base_stage_id: stage1.id)
      end
    end

    trait :create_me_complete_stage do
      after(:create) do |task|
        create(:me_done_sign_stage, sequence: 1, sign_task: task)
      end
    end

    trait :create_a_complete_stage do
      after(:create) do |task|
        create(:a_done_sign_stage, sequence: 1, sign_task: task)
      end
    end

    trait :create_b_complete_stage do
      after(:create) do |task|
        create(:b_done_sign_stage, sequence: 1, sign_task: task)
      end
    end

    trait :create_completed_stages1 do
      after(:create) do |task|
        create(:a_done_sign_stage, sign_task: task)
        create(:b_done_sign_stage, sign_task: task)
      end
    end

    trait :create_completed_stages2 do
      after(:create) do |task|
        create(:me_done_sign_stage, sequence: 1, sign_task: task)
      end
    end

    trait :create_completed_stages3 do
      after(:create) do |task|
        create(:a_done_sign_stage, sequence: 1, sign_task: task)
        create(:b_done_sign_stage, sequence: 2, sign_task: task)
        create(:me_done_sign_stage, sequence: 3, sign_task: task)
      end
    end

    trait :create_completed_stages4 do
      after(:create) do |task|
        create(:a_done_sign_stage, :with_verify_methods, sign_task: task)
        create(:b_done_sign_stage, sign_task: task)
      end
    end

    trait :create_completed_form_stages do
      after(:create) do |task|
        create(:form_done_sign_stage, sequence: 1, sign_task: task)
        create(:b_done_sign_stage, sequence: 2, sign_task: task)
        create(:me_done_sign_stage, sequence: 3, sign_task: task)
      end
    end

    trait :create_not_related_stages do
      after(:create) do |task|
        create(:b_done_sign_stage, sequence: 2, sign_task: task)
      end
    end

    trait :create_owner_need_otp_stages do
      after(:create) do |task|
        create(:me_processing_sign_stage, sequence: 1, sign_task: task)

        signer_detect_verify = {
          sequence: 1,
          verify_type: 'signer_detect',
          execute_type: VerifyMethod.execute_types[:normal]
        }

        task.sign_stages.each do |stage|
          stage.verify_methods.create(signer_detect_verify)
        end
      end
    end

    trait :create_owner_need_read_otp_stages do
      after(:create) do |task|
        create(:me_processing_sign_stage, sequence: 1, sign_task: task)

        signer_detect_verify = {
          sequence: 1,
          verify_type: 'signer_detect',
          execute_type: VerifyMethod.execute_types[:normal],
          occassion: "read"
        }

        task.sign_stages.each do |stage|
          stage.verify_methods.create(signer_detect_verify)
        end
      end
    end

    trait :create_signer_need_otp_stages do
      transient do
        verify_type { "verify_method" }
      end

      after(:create) do |task, evaluator|
        stage = create(:processing_sign_stage, email: create(:member_otp).email, sequence: 1, sign_task: task)

        method_type = evaluator.verify_type&.to_sym || :verify_method
        FactoryBot.create(method_type, stage: stage)
      end
    end

    trait :create_signer_need_otp_stages2 do
      transient do
        verify_type { "verify_method" }
      end

      after(:create) do |task, evaluator|
        stage1 = create(:me_processing_sign_stage, sequence: 1, sign_task: task)
        create(:a_sign_stage, sequence: 2, sign_task: task, action: 'review', base_stage_id: stage1.id)

        method_type = evaluator.verify_type&.to_sym || :verify_method
        FactoryBot.create(method_type, stage: stage1)
      end
    end

    trait :create_signer_need_otp_confirm_stages do
      transient do
        verify_type { "verify_method" }
      end

      after(:create) do |task, evaluator|
        stage1 = create(:me_reviewed_sign_stage, sequence: 1, sign_task: task)
        create(:a_done_sign_stage, sequence: 2, sign_task: task, action: 'review', base_stage_id: stage1.id)

        method_type = evaluator.verify_type&.to_sym || :verify_method
        FactoryBot.create(method_type, stage: stage1)
      end
    end

    trait :create_quick_signer_need_otp_stages do
      transient do
        occassion { "read" }
      end

      after(:create) do |task, evaluator|
        create(:processing_sign_stage, email: create(:not_register_member_need_otp).email, sequence: 1, sign_task: task)

        signer_detect_verify = {
          sequence: 1,
          verify_type: 'signer_detect',
          execute_type: VerifyMethod.execute_types[:normal],
          occassion: evaluator.occassion
        }

        task.sign_stages.each do |stage|
          stage.verify_methods.create(signer_detect_verify)
        end
      end
    end

    trait :create_not_kdan_stages do
      after(:create) do |task|
        create(:not_kdan_processing_sign_stage, sequence: 1, sign_task: task)
      end
    end

    trait :create_not_kdan_stages2 do
      after(:create) do |task|
        stage1 = create(:not_kdan_processing_sign_stage, sequence: 1, sign_task: task)
        create(:me_sign_stage, sequence: 2, sign_task: task, action: 'review', base_stage_id: stage1.id)
      end
    end

    trait :create_not_kdan_done_stages do
      after(:create) do |task|
        create(:not_kdan_done_sign_stage, sequence: 1, sign_task: task)
      end
    end

    trait :create_not_kdan_other_processing_stages do
      after(:create) do |task|
        create(:not_kdan_done_sign_stage, sequence: 1, sign_task: task)
        create(:me_processing_sign_stage, sequence: 2, sign_task: task)
      end
    end

    trait :create_not_kdan_review_stages do
      after(:create) do |task|
        stage1 = create(:a_signed_sign_stage, sequence: 1, sign_task: task)
        create(:not_kdan_processing_sign_stage, sequence: 2, sign_task: task, action: 'review', base_stage_id: stage1.id)
      end
    end

    trait :create_not_kdan_modify_stages do
      after(:create) do |task|
        stage1 = create(:not_kdan_modifying_sign_stage, sequence: 1, sign_task: task)
        create(:me_rejected_sign_stage, sequence: 2, sign_task: task, action: 'review', base_stage_id: stage1.id)
      end
    end

    trait :create_not_kdan_confirm_stages do
      after(:create) do |task|
        stage1 = create(:not_kdan_reviewed_sign_stage, sequence: 1, sign_task: task)
        create(:me_done_sign_stage, sequence: 2, sign_task: task, action: 'review', base_stage_id: stage1.id)
      end
    end

    trait :create_a_declined_stage do
      after(:create) do |task|
        create(:a_declined_sign_stage, sequence: 1, sign_task: task)
      end
    end

    trait :create_declined_with_form_stages do
      after(:create) do |task|
        create(:form_done_sign_stage, sequence: 1, sign_task: task)
        create(:a_declined_sign_stage, sequence: 1, sign_task: task)
      end
    end

    trait :create_a_file_failed_stage do
      after(:create) do |task|
        create(:a_file_failed_sign_stage, sequence: 1, sign_task: task)
      end
    end

    trait :create_fields_stages do
      after(:create) do |task|
        create(:a_done_sign_stage, sequence: 1, sign_task: task)
        create(:me_processing_with_fields_stage, sequence: 2, sign_task: task)
        create(:b_sign_stage, sequence: 3, sign_task: task)
      end
    end

    trait :create_field_groups_stages do
      after(:create) do |task|
        create(:a_done_sign_stage, sequence: 1, sign_task: task)
        create(:me_processing_with_field_setting_group, sequence: 2, sign_task: task)
        create(:b_sign_stage, sequence: 3, sign_task: task)
      end
    end

    trait :create_not_expire_soon_setting do
      after(:create) do |task|
        create(:not_expire_soon_setting, sign_task: task)
      end
    end

    trait :create_expire_soon_setting do
      after(:create) do |task|
        create(:expire_soon_setting, sign_task: task)
      end
    end

    trait :create_expire_now_setting do
      after(:create) do |task|
        create(:expire_now_setting, sign_task: task)
      end
    end

    trait :create_expired_setting do
      after(:create) do |task|
        create(:expired_setting, sign_task: task)
      end
    end

    trait :create_systemtime_field do
      after(:create) do |task|
        stage = task.sign_stages.first

        create(:field_setting, :systemtime_year_roc, source: task, stage: stage)
        create(:field_setting, :systemtime_year_ad, source: task, stage: stage)
        create(:field_setting, :systemtime_month, source: task, stage: stage)
        create(:field_setting, :systemtime_day, source: task, stage: stage)
      end
    end

    factory :draft_task, traits: [:draft_status, :own_by_me, :my_file, :create_draft_stages, :create_not_expire_soon_setting]
    factory :draft_task2, traits: [:draft_status, :own_by_a, :a_file, :create_draft_stages, :create_not_expire_soon_setting]
    factory :reissue_for_me1, traits: [:waiting_status, :own_by_me, :normal_file, :create_reissue_for_me_stages1, :create_expire_soon_setting]
    factory :waiting_form_task, traits: [:form_type, :waiting_status, :own_by_a, :my_file, :create_waiting_form_stages, :create_not_expire_soon_setting]
    factory :waiting_for_me1, traits: [:waiting_status, :own_by_me, :normal_file, :create_waiting_for_me_stages1, :create_expire_soon_setting]
    factory :waiting_for_me2, traits: [:waiting_status, :own_by_a, :a_file, :create_waiting_for_me_stages2, :create_not_expire_soon_setting]
    factory :waiting_for_me3, traits: [:waiting_status, :own_by_me, :normal_file, :create_waiting_for_me_stages1, :create_expire_now_setting]
    factory :waiting_for_me4, traits: [:waiting_status, :own_by_me, :normal_file, :create_waiting_for_me_stages3, :create_expire_now_setting]
    factory :waiting_for_me_form_task, traits: [:form_type, :waiting_status, :own_by_a, :a_file, :create_waiting_for_me_form_stages, :create_not_expire_soon_setting]
    factory :waiting_for_me_with_fields, traits: [:waiting_status, :own_by_me, :normal_file, :create_fields_stages, :create_expire_soon_setting]
    factory :waiting_for_me_with_field_groups, traits: [:waiting_status, :own_by_me, :normal_file, :create_field_groups_stages, :create_expire_soon_setting]
    factory :waiting_for_me_with_photo_signature, traits: [:waiting_status, :own_by_me, :normal_file, :create_waiting_for_me_stages4, :create_expire_soon_setting]
    factory :waiting_for_others1, traits: [:waiting_status, :own_by_me, :normal_file, :create_waiting_for_other_stages1, :create_expire_soon_setting]
    factory :waiting_for_others2, traits: [:waiting_status, :own_by_a, :a_file, :create_waiting_for_other_stages2, :create_not_expire_soon_setting]
    factory :waiting_for_others3, traits: [:waiting_status, :own_by_a, :a_file, :create_waiting_for_other_stages3, :create_not_expire_soon_setting]
    factory :waiting_for_others4, traits: [:waiting_status, :own_by_me, :a_file, :create_waiting_for_other_stages4, :create_not_expire_soon_setting]
    factory :waiting_for_me_review1, traits: [:waiting_status, :own_by_me, :normal_file, :create_waiting_for_me_review_stages1, :create_not_expire_soon_setting]
    factory :waiting_for_me_review2, traits: [:waiting_status, :own_by_me, :normal_file, :create_waiting_for_me_review_stages2, :create_not_expire_soon_setting]
    factory :waiting_for_me_modify1, traits: [:waiting_status, :own_by_me, :normal_file, :create_waiting_for_me_modify_stages1, :create_not_expire_soon_setting]
    factory :waiting_for_me_confirm1, traits: [:waiting_status, :own_by_me, :normal_file, :create_waiting_for_me_confirm_stages1, :create_not_expire_soon_setting]
    factory :completed_task1, traits: [:completed_status, :own_by_me, :my_file, :create_completed_stages1, :create_expire_soon_setting]
    factory :completed_task2, traits: [:completed_status, :own_by_me, :my_file, :create_completed_stages2, :create_not_expire_soon_setting]
    factory :completed_task3, traits: [:completed_status, :own_by_a, :my_file, :create_completed_stages3, :create_not_expire_soon_setting]
    factory :completed_task4, traits: [:completed_status, :own_by_me, :my_file, :create_completed_stages4, :create_not_expire_soon_setting]
    factory :completed_form_task, traits: [:form_type, :completed_status, :own_by_a, :my_file, :create_completed_form_stages, :create_not_expire_soon_setting]
    factory :expired_task1, traits: [:expired_status, :own_by_me, :my_file, :create_waiting_for_me_stages1, :create_expired_setting]
    factory :expired_task2, traits: [:expired_status, :own_by_me, :my_file, :create_waiting_for_me_stages1, :create_expired_setting]
    factory :expired_task3, traits: [:expired_status, :own_by_a, :my_file, :create_waiting_for_me_stages1, :create_expired_setting]
    factory :expired_task4, traits: [:expired_status, :own_by_me, :my_file, :create_waiting_for_me_stages3, :create_expired_setting]
    factory :deleted_task1, traits: [:deleted_status, :own_by_me, :my_file, :create_completed_stages1, :create_not_expire_soon_setting]
    factory :declined_task1, traits: [:declined_status, :own_by_me, :my_file, :create_a_declined_stage, :create_not_expire_soon_setting]
    factory :declined_form_task, traits: [:form_type, :declined_status, :own_by_me, :my_file, :create_declined_with_form_stages, :create_not_expire_soon_setting]
    factory :not_related, traits: [:completed_status, :own_by_a, :amy_file, :create_not_related_stages, :create_not_expire_soon_setting]
    factory :not_related2, traits: [:waiting_status, :own_by_a, :amy_file, :create_not_related_stages, :create_not_expire_soon_setting]
    factory :owner_need_otp_task, traits: [:waiting_status, :own_by_a, :a_file, :create_owner_need_otp_stages, :create_not_expire_soon_setting]
    factory :owner_need_read_otp_task, traits: [:waiting_status, :own_by_a, :a_file, :create_owner_need_read_otp_stages, :create_not_expire_soon_setting]
    factory :signer_need_otp_task, traits: [:waiting_status, :own_by_me, :a_file, :create_signer_need_otp_stages, :create_not_expire_soon_setting]
    factory :signer_need_otp_task2, traits: [:waiting_status, :own_by_me, :a_file, :create_signer_need_otp_stages2, :create_not_expire_soon_setting]
    factory :signer_need_otp_confirm_task, traits: [:waiting_status, :own_by_me, :a_file, :create_signer_need_otp_confirm_stages, :create_not_expire_soon_setting]
    factory :quick_signer_need_otp_task, traits: [:waiting_status, :own_by_a, :a_file, :create_quick_signer_need_otp_stages, :create_not_expire_soon_setting]
    factory :quick_sign_task, traits: [:waiting_status, :own_by_me, :normal_file, :create_not_kdan_stages, :create_not_expire_soon_setting]
    factory :quick_sign_task2, traits: [:waiting_status, :own_by_me, :normal_file, :create_not_kdan_stages2, :create_not_expire_soon_setting]
    factory :quick_sign_completed_task, traits: [:completed_status, :own_by_me, :normal_file, :create_not_kdan_done_stages, :create_not_expire_soon_setting]
    factory :quick_sign_waiting_for_other_task, traits: [:waiting_status, :own_by_me, :normal_file, :create_not_kdan_other_processing_stages, :create_not_expire_soon_setting]
    factory :quick_sign_waiting_for_review_task, traits: [:waiting_status, :own_by_me, :normal_file, :create_not_kdan_review_stages, :create_not_expire_soon_setting]
    factory :quick_sign_waiting_for_modify_task, traits: [:waiting_status, :own_by_me, :normal_file, :create_not_kdan_modify_stages, :create_not_expire_soon_setting]
    factory :quick_sign_waiting_for_confirm_task, traits: [:waiting_status, :own_by_me, :normal_file, :create_not_kdan_confirm_stages, :create_not_expire_soon_setting]

    factory :me_sender_waiting_task, traits: [:waiting_status, :own_by_me, :normal_file, :create_waiting_for_b_stage, :create_not_expire_soon_setting]
    factory :me_signer_waiting_task, traits: [:waiting_status, :own_by_b, :normal_file, :create_waiting_for_me_stage, :create_not_expire_soon_setting]
    factory :a_sender_waiting_task, traits: [:waiting_status, :own_by_a, :normal_file, :create_waiting_for_b_stage, :create_not_expire_soon_setting]
    factory :a_signer_waiting_task, traits: [:waiting_status, :own_by_b, :normal_file, :create_waiting_for_a_stage, :create_not_expire_soon_setting]
    factory :me_sender_complete_task, traits: [:completed_status, :own_by_me, :normal_file, :create_b_complete_stage, :create_not_expire_soon_setting]
    factory :me_signer_complete_task, traits: [:completed_status, :own_by_b, :normal_file, :create_me_complete_stage, :create_not_expire_soon_setting]
    factory :a_sender_complete_task, traits: [:completed_status, :own_by_a, :normal_file, :create_b_complete_stage, :create_not_expire_soon_setting]
    factory :a_signer_complete_task, traits: [:completed_status, :own_by_b, :normal_file, :create_a_complete_stage, :create_not_expire_soon_setting]

    factory :a_file_failed_task, traits: [:waiting_status, :own_by_me, :normal_file, :create_a_file_failed_stage, :create_not_expire_soon_setting]

    after(:create) do |task|
      create(:sign_event, action_name: 'created', sign_task: task, owner: task.owner, action_member: task.owner)
      create(:sign_event, action_name: 'sent', sign_task: task, owner: task.owner, action_member: task.owner) unless task.draft?
      create(:uploaded_file, storable: task, label: 'original')
      create(:uploaded_file, storable: task, label: 'pristine_original') if task.expired?
      create(:uploaded_file, storable: task, label: 'full')
      next unless task.completed?
      create(:uploaded_file, storable: task, label: 'completed')
      create(:uploaded_file, storable: task, label: 'audit_trail')
      mock_complete_worker(task)
      task.update(completed_at: Time.zone.now, group_id: task.owner.group_id)
    end
  end

  # without creating service_file('full')
  factory :sign_and_send, class: 'SignTask' do
    trait :sign_and_send_type do sign_type { SignTask.sign_types['sign_and_send'] } end

    factory :me_completed_self_task, traits: [:completed_status, :own_by_me, :amy_file, :sign_and_send_type]
    factory :a_completed_self_task, traits: [:completed_status, :own_by_a, :amy_file, :sign_and_send_type]

    after(:create) do |task|
      create(:uploaded_file, storable: task, label: 'completed')
      task.update(completed_at: Time.zone.now, group_id: task.owner.group_id)
    end
  end
end
