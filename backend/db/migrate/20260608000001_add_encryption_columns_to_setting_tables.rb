class AddEncryptionColumnsToSettingTables < ActiveRecord::Migration[6.1]
  SETTING_TABLES = %i[template_settings envelope_settings task_settings].freeze

  def change
    SETTING_TABLES.each do |table|
      add_column table, :is_encrypted,        :boolean, default: false, null: false
      add_column table, :completion_password, :text
    end
  end
end
