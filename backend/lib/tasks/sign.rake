namespace :sign do
  desc 'remind signer not forget to sign'
  task :forget_remind, [:pass_days] => :environment do |t, args|
    pass_days = args[:pass_days].to_i
    processing_hour = pass_days.days.ago - 1.hours
    processing_between = processing_hour.beginning_of_hour..processing_hour.end_of_hour
    members_id_mapping = Member.all.index_by(&:id)
    envelope_remind_map = { forget_remind: {}, signer_ca_fail_notify_remind: {} }
    SignStage.processing.where(processing_from: processing_between).includes(:sign_task).in_batches.each_record do |sign_stage|
      next unless sign_stage.sign_task.forget_remindable?
      next if members_id_mapping[sign_stage.actor_id]&.group_id != sign_stage.group_id
      if sign_stage.sign_task.in_envelope?
        envelope_remind_map[:forget_remind][sign_stage.sign_task.envelope_id] = sign_stage.id
      else
        Notification::SignRemindWorker.perform_async(:forget_remind, sign_stage.id, pass_days: pass_days)
      end
    end

    SignStage.processing_file_failed.where(processing_from: processing_between).includes(:sign_task).in_batches.each_record do |sign_stage|
      next unless sign_stage.sign_task.forget_remindable?
      next if members_id_mapping[sign_stage.actor_id]&.group_id != sign_stage.group_id
      if sign_stage.sign_task.in_envelope?
        envelope_remind_map[:signer_ca_fail_notify_remind][sign_stage.sign_task.envelope_id] = sign_stage.id
      else
        Notification::SignRemindWorker.perform_async(:signer_ca_fail_notify_remind, sign_stage.id)
      end
    end

    envelope_remind_map.each do |remind_type, envelope_sign_stage_ids|
      envelope_sign_stage_ids.each do |_envelope_id, stage_id|
        Notification::SignRemindWorker.perform_async(remind_type, stage_id, pass_days: pass_days)
      end
    end
  end

  desc 'remind signer expire of sign'
  task :expire_remind => :environment do
    remind_hour = 1.hour.after
    remind_between = remind_hour.beginning_of_hour..remind_hour.end_of_hour
    members_id_mapping = Member.all.index_by(&:id)
    envelope_remind_map = { expire_remind: {}, signer_ca_fail_notify_remind: {} }
    SignStage.processing.includes(sign_task: :task_setting).where(task_settings: { expire_remind_at: remind_between }).in_batches.each_record do |sign_stage|
      sign_task = sign_stage.sign_task
      next unless sign_task.expire_remindable?
      next if members_id_mapping[sign_stage.actor_id]&.group_id != sign_stage.group_id
      deadline = sign_task.task_setting&.display_deadline
      if sign_task.in_envelope?
        envelope_remind_map[:expire_remind][sign_task.envelope_id] = { stage_id: sign_stage.id, deadline: deadline }
      else
        Notification::SignRemindWorker.perform_async(:expire_remind, sign_stage.id, deadline: deadline)
      end
    end
    
    SignStage.processing_file_failed.includes(sign_task: :task_setting).where(task_settings: { expire_remind_at: remind_between }).in_batches.each_record do |sign_stage|
      sign_task = sign_stage.sign_task
      next unless sign_task.expire_remindable?
      next if members_id_mapping[sign_stage.actor_id]&.group_id != sign_stage.group_id
      deadline = sign_task.task_setting&.display_deadline
      if sign_task.in_envelope?
        envelope_remind_map[:signer_ca_fail_notify_remind][sign_task.envelope_id] = { stage_id: sign_stage.id, deadline: deadline }
      else
        Notification::SignRemindWorker.perform_async(:signer_ca_fail_notify_remind, sign_stage.id, deadline: deadline)
      end
    end

    envelope_remind_map.each do |remind_type, envelope_remind_info|
      envelope_remind_info.each do |_envelope_id, remind_info|
        Notification::SignRemindWorker.perform_async(remind_type, remind_info[:stage_id], deadline: remind_info[:deadline])
      end
    end
  end

  desc 'expire task in period'
  task :expire_now => :environment do
    SignTask.detect_and_setup_expired
  end

end
