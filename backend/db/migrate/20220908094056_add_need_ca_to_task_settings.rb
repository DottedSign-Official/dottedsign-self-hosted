class AddNeedCaToTaskSettings < ActiveRecord::Migration[6.1]
  def change
    add_column :task_settings, :need_ca, :boolean, default: false
  end
end
