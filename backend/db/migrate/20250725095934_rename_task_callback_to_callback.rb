class RenameTaskCallbackToCallback < ActiveRecord::Migration[6.1]
  def up
    rename_table :task_callbacks, :callbacks
    rename_column :callbacks, :sign_task_id, :source_id
    add_column :callbacks, :source_type, :string, default: 'SignTask'
  end

  def down
    rename_table :callbacks, :task_callbacks
    rename_column :task_callbacks, :source_id, :sign_task_id
    remove_column :task_callbacks, :source_type
  end
end
