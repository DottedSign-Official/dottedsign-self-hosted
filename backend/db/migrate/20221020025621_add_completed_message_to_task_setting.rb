class AddCompletedMessageToTaskSetting < ActiveRecord::Migration[6.1]
  def change
    add_column :task_settings, :completed_message, :text
    add_column :task_settings, :completed_reference_setting, :json, default: []
  end
end
