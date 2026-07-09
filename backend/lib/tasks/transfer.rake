namespace :transfer do

  desc 'Normalize contact emails (strip whitespace) and remove resulting duplicates'
  task normalize_contact_emails: :environment do
    puts "[#{Time.zone.now}] Start normalizing contact emails"

    normalized_count = 0
    removed_count = 0

    Contact.where("email != TRIM(email)").find_each do |contact|
      stripped_email = contact.email.strip.downcase

      duplicate = Contact.where(member_id: contact.member_id)
                         .where("LOWER(TRIM(email)) = ?", stripped_email)
                         .where.not(id: contact.id)
                         .first

      if duplicate
        contact.destroy
        removed_count += 1
      else
        contact.update_column(:email, stripped_email)
        normalized_count += 1
      end
    end

    puts "[#{Time.zone.now}] Done. Normalized: #{normalized_count}, Removed duplicates: #{removed_count}"
  end

  desc 'move signature raw from db to active_storage'
  task :signature => :environment do
    class_list = ['Signature', 'GuestSignature'].freeze
    class_list.each do |signature_type|
      puts "start transfer #{signature_type} raw to service file"
      count = 0
      has_service_file = 0

      signature_class = signature_type.constantize
      signature_class.includes(:service_files).where.not(raw: nil).in_batches.each_record do |signature|
        if signature.service_files.any? { |service_file| service_file.label == 'signature_raw' }
          has_service_file += 1
          next
        end
        file_type = signature_type == 'Signature' ? signature.file_type : 'png'
        signature.upload_service_file('signature_raw', io: StringIO.new(Base64.decode64(signature.raw)), content_type: "image/#{file_type}", filename: "signature_raw.#{file_type}", skip_callback: true)
        count += 1
      end

      puts "#{signature_type} transfer status:"
      puts "transferred: #{count}, already has service file: #{has_service_file}, total: #{signature_class.where.not(raw: nil).count}"
      puts "---"
    end
  end

end
