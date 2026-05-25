if Rails.env == 'production' || Rails.env == 'preparing'
  tasks = Rake.application.instance_variable_get '@tasks'
  tasks.delete 'db:reset'
  tasks.delete 'db:drop'
  namespace :db do
    desc 'db:reset not available in this environment'
    task :reset do
      puts 'db:reset has been disabled'
    end
    desc 'db:drop not available in this environment'
    task :drop do
      puts 'db:drop has been disabled'
    end
  end
end
