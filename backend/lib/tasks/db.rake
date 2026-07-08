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

namespace :db do
  SETTING_TABLES = [
    { table: 'template_settings', type: 'TemplateSetting' },
    { table: 'envelope_settings', type: 'EnvelopeSetting' },
    { table: 'task_settings',     type: 'TaskSetting' }
  ].freeze

  desc 'Migrate encryption_settings data into inline setting columns'
  task migrate_encryption_settings: :environment do
    conn = ActiveRecord::Base.connection

    unless conn.table_exists?(:encryption_settings)
      puts '[db:migrate_encryption_settings] encryption_settings table not found, nothing to do'
      next
    end

    ActiveRecord::Base.transaction do
      SETTING_TABLES.each do |entry|
        conn.execute(<<~SQL)
          UPDATE #{entry[:table]} s
          SET is_encrypted        = e.is_encrypted,
              completion_password = e.completion_password
          FROM encryption_settings e
          WHERE e.configurable_type = '#{entry[:type]}'
            AND e.configurable_id   = s.id
        SQL
        puts "[db:migrate_encryption_settings] Migrated data into #{entry[:table]}"
      end

      conn.execute('DELETE FROM encryption_settings')
      puts '[db:migrate_encryption_settings] Cleared encryption_settings data'
    end

    puts '[db:migrate_encryption_settings] Done'
  end
end
