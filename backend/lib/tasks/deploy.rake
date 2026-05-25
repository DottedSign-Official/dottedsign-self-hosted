require "#{Rails.root}/lib/tasks/helpers/option_helper.rb"

include OptionHelper

EXPORT_PARAM = [
  { key: :image_name, desc: '', default_value: '' }, 
  { key: :file_name, desc: '', default_value: '' }
]

BACKEND_BUILD_PARAM = [
  { key: :image_name, default_value: 'jackrabbit_server:latest-sm' },
  { key: :platform, desc: '', default_value: 'linux' }
]

FRONTEND_BUILD_PARAM = [
  { key: :folder, desc: '', default_value: '../jackrabbit-client' },
  { key: :image_name, desc: '', default_value: 'jackrabbit_client:latest-sm' },
  { key: :env, desc: '', default_value: 'preparing' },
  { key: :app_id, desc: '', default_value: 'sMtdr0etWSR7jqmo9ToYwfMYiuPoCsJ0eQgcXslLv8c' },
  { key: :app_secret, desc: '', default_value: 'CstD7P51mGyHrBKr2b1KI9o9w8C-qjrXGpPHvryB7Jk' },
]

namespace :deploy do
  desc 'export tar'
  task :export do |task|
    params = EXPORT_PARAM

    options = set_options(task, params)
    next puts options[:content] if options[:show_help]

    export_image_to_tar(options)
  end

  namespace :backend do
    desc 'deploy backend to kdan demo machine'
    task :to_kdan_demo do |task|
      params = [
        { type: :switch, s_key: :b, key: :build, desc: "build image first"}, 
        { key: :machine, default_value: 'jackrabbit_demo' }
      ]

      params += BACKEND_BUILD_PARAM
      params += EXPORT_PARAM

      change_default_value(params, :image_name, 'jackrabbit_server:latest-sm')
      change_default_value(params, :file_name, 'jackrabbit_server_latest-sm.tar')

      options = set_options(task, params)
      next puts options[:content] if options[:show_help]

      build_backend_image(options)
      export_image_to_tar(options)
      push_to_demo_machine(options)
      restart_demo_service(options)
    end
    
    desc 'build backend image'
    task :build do |task|
      params = BACKEND_BUILD_PARAM

      options = set_options(task, params)
      next puts options[:content] if options[:show_help]

      build_backend_image(options)
    end

  end

  namespace :frontend do
    desc 'build frontend image'
    task :build do |task|
      params = FRONTEND_BUILD_PARAM

      options = set_options(task, params)
      next puts options[:content] if options[:show_help]

      build_frontend_image(options)
    end

  end
end

private
def build_frontend_image(options = {}, demo: false)
  command = "docker build -t #{options[:image_name]} --build-arg ENV=#{options[:env]} --build-arg AUTH_CLIENT_ID=#{options[:app_id]} --build-arg AUTH_CLIENT_SECRET=#{options[:app_secret]} --progress=plain --no-cache ."
  return puts command if options[:demo]

  Dir.chdir(options[:folder]) do
    sh command
  end 
end

def build_backend_image(options = {}, demo: false)
  if options[:platform] == 'linux'
    command = "docker build --platform linux/amd64 --build-arg BUNDLE_GEMS_CONTRIBSYS_COM=21090d2d:9da3b1d0 -t #{options[:image_name]} ."
  else
    command = "docker build --build-arg BUNDLE_GEMS_CONTRIBSYS_COM=21090d2d:9da3b1d0 -t #{options[:image_name]} ."
  end

  return puts command if options[:demo]
  sh command
end

def export_image_to_tar(options = {}, demo: false)
  command = "docker save -o #{options[:file_name]} #{options[:image_name]}"

  return puts command if options[:demo]
  sh command
end

def push_to_demo_machine(options = {}, demo: false)
  command = "scp #{options[:file_name]} #{options[:machine]}:~"

  return puts command if options[:demo]
  sh command 
end

def restart_demo_service(options = {}, demo: false)
  command = "ssh #{options[:machine]} 'docker load < #{options[:file_name]} && cd self-member && docker-compose up -d'"

  return puts command if options[:demo]
  sh command 
end
