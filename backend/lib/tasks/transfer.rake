namespace :transfer do

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
