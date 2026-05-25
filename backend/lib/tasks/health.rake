namespace :health do
  desc 'check server status'
  task :check_db => :environment do
    ActiveRecord::Base.establish_connection
    ActiveRecord::Base.connection
    puts ActiveRecord::Base.connected?
  end

  task :check_redis => :environment do
    Rails.cache.write("test", "test_value")
    puts Rails.cache.read("test") == "test_value"
  end

  task :check_kmpdf => :environment do
    flatten_service = KmpdfTool::PdfFlatten.call("#{Rails.root}/spec/fixtures/files/test.pdf", :form)
    puts flatten_service.success?
  end

  task :create_log => :environment do
    Logger.new("#{Rails.root}/log/health_test.log").info("test")
  end

  task :check_hsm => :environment do
    unless Settings.default.ca.ca_enable
      puts true
      next
    end
    old_stdout = $stdout
    $stdout = StringIO.new
    input_path = "#{Rails.root}/spec/fixtures/files/test.pdf"
    ap_info = DigitalCertificate::Gra.get_system_ap_info
    resp = DigitalCertificate::Hsm.apply_ap_cert(input_path, ap_info)
    raise "response status is:#{resp['status']}" unless resp['status'] == 200
    raise "response code is:#{resp['code']}" unless resp['code'] == '0'
    $stdout = old_stdout
    puts true
  end

  task :check_gra => :environment do
    unless Settings.default.ca.ca_enable
      puts true
      next
    end
    old_stdout = $stdout
    $stdout = StringIO.new
    email='AATL-TEST-AP@protonmail.com'
    resp = DigitalCertificate::Gra.check_ca(email)
    raise "response status is:#{resp['status']}" unless resp['status'] == 200
    raise "response result is:#{resp['result']}" unless resp['result'] == 1
    $stdout = old_stdout
    puts true
  end

end
