namespace :clean do
  desc 'clean draft failed task'
  task :draft_failed_task => :environment do
    puts "[#{Time.zone.now}] Start to clean draft failed tasks"
    clean_count = 0
    need_clean_envelope_ids = []
    threshold = 15.minutes.ago
    SignTask.joins(:service_files).where(service_files: { label: ['original', 'full'], uploaded_at: nil }).where('service_files.created_at < ?', threshold).in_batches.each_record do |task|
      task.deleted!
      task.in_envelope? ? need_clean_envelope_ids << task.envelope_id : clean_count += 1
    end
    puts "[#{Time.zone.now}] Clean #{clean_count} draft tasks"

    puts "[#{Time.zone.now}] Start to clean draft failed envelopes"
    Envelope.where(id: need_clean_envelope_ids).in_batches.each_record do |envelope|
      # using the do_deleted method instead of updating status to avoid inconsistent task states
      # within the same envelope when some task uploads successfully and others failed
      envelope.do_deleted
    end
    puts "[#{Time.zone.now}] Clean #{need_clean_envelope_ids.uniq.size} draft envelopes"
  end

  desc 'clean not finish sign_and_send task'
  task :sign_and_send_failed_task => :environment do
    puts "[#{Time.zone.now}] Start to clean sign_and_send failed tasks"
    clean_count = 0
    threshold = 15.minutes
    SignTask.sign_and_send.where(created_at: threshold.ago..Time.zone.now).includes(:completed_file).in_batches.each_record do |task|
      next if task.completed_file.present?
      task.deleted!
      clean_count += 1
    end
    puts "[#{Time.zone.now}] Clean #{clean_count} sign_and_send tasks"
  end

  desc 'clean not upload file templates'
  task :processing_templates => :environment do
    puts "[#{Time.zone.now}] Start to clean templates created over 1 hour and status is processing"
    clean_count = 0
    threshold = 1.hours.ago
    Template.includes(:original_file).where('created_at < ?', threshold).processing.in_batches.each_record do |template|
      template.original_file.delete_file if template.original_file.present?
      template.deleted!
      clean_count += 1
    end
    puts "[#{Time.zone.now}] Clean #{clean_count} processing templates"
  end

  desc 'clean before complete task file older than 14 day '
  task :before_complete_task => :environment do
    puts "[#{Time.zone.now}] Start clean to before complete task file"
    clean_count = 0
    SignTask.includes(:sign_stages, :xfdf_documents, :service_files).where('updated_at < ?', 14.days.ago).
      where(status: [:completed, :expired], file_status: :file_exist).each do |sign_task|
      sign_task.delete_dependency_file(except_label: ['original', 'completed', 'audit_trail'])
      sign_task.deleted_before_complete_file!
      clean_count += 1
    end
    puts "[#{Time.zone.now}] Clean #{clean_count} task"
  end

  desc 'clean unused photo signature older than 3 days'
  task :unused_photo_signature => :environment do
    puts "[#{Time.zone.now}] Start clean unused photo signature"
    signatures = Signature.photo_category.where('updated_at < ?', 3.days.ago).where("other_info ->> 'field_setting_id' IS NULL").destroy_all
    puts "[#{Time.zone.now}] Clean #{signatures.count} unused photo signature"

    guest_signatures = GuestSignature.photo_category.where('updated_at < ?', 3.days.ago).where("other_info ->> 'field_setting_id' IS NULL").destroy_all
    puts "[#{Time.zone.now}] Clean #{guest_signatures.count} unused photo guest signature"
  end
end
