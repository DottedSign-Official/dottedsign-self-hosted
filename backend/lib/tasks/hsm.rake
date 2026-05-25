require "#{Rails.root}/lib/tasks/helpers/option_helper.rb"

include OptionHelper

namespace :hsm do

  desc 'apply ap cert'
  task :apply_ap_cert => :environment do |task|
    params = [
      { key: :f, desc: 'input file path', required: true },
      { key: :o, desc: 'output file path', required: true }
    ]

    options = set_options(task, params)
    next puts options[:content] if options[:show_help]

    input_path = options[:f]
    raise "input file path not exist: #{input_path}" unless File.exist?(input_path)

    ap_info = DigitalCertificate::Gra.get_system_ap_info
    next puts "apply hsm with input path: #{options[:f]}, output path: #{options[:o]}, info: #{ap_info.to_json}" if options[:demo]
    
    resp = DigitalCertificate::Hsm.apply_ap_cert(input_path, ap_info)
    raise "response status is:#{resp['status']}" unless resp['status'] == 200
    raise "response code is:#{resp['code']}" unless resp['code'] == '0'

    output_path = options[:o]
    io = StringIO.new(Base64.strict_decode64(resp['msg']))
    File.open(output_path, 'wb') { |f| f.write(io.read) }
  end

end
